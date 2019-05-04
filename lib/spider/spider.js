const os = require('os');
const fs = require('fs');
const path = require('path');

const Sitemap = require('sitemapper');
const Spider = require('crawler');

const defaultOptions = {
  maxConnections: os.cpus().length,
  forceUtf8: true,
  skipDuplicates: true,
  retries: 3,
  retryTimeout: 3000,
  gzip: true,
  jar: true,
  referer: false,
  delay: [200, 300],
  timeout: 5000,
  userAgent: 'Brainybot',
  jQuery: {
    name: 'cheerio',
    options: {
      xmlMode: false,
      normalizeWhitespace: true,
      decodeEntities: true
    }
  }
};

class Crawler {

  constructor(source = {}, options = {}) {
    if (!source.name)
      throw new TypeError('invalid \"source.name\" argument');

    if (!source.storage)
      throw new TypeError('invalid \"source.storage\" argument');

    if (!source.model)
      throw new TypeError('invalid \"source.model\" argument');

    var options = Object.assign({}, defaultOptions, options);
    options.rotateUA = Array.isArray(options.userAgent);
    options.preRequest = this._onRequest.bind(this);
    options.callback = this._onResponse.bind(this);

    const spider = new Spider(options);
    spider.on('drain', this._onFinish.bind(this));

    this._source = source;
    this._options = options;
    this._spider = spider;
    this._buffer = [];
  }

  /** @public */
  start() {
    const { _source: source, _spider: spider } = this;
    const { name, urls, sitemap, filter } = source;

    console.info(`${name}: parse started`);

    if (urls)
      return spider.queue(urls.filter(filterUrl));

    if (sitemap)
      new Sitemap({ url: sitemap, timeout: 15000 /* 15 secs */ })
        .fetch()
          .then(({ sites: urls }) => spider.queue(urls.filter(filterUrl)))
          .catch((error) => console.error(error));

    function filterUrl(url) {
      if (!filter)
        return true;

      switch (filter.constructor.name) {
        case 'Function':
          return filter();
          break;
        case 'RegExp':
          return filter.test(url);
          break;
        default:
          break;
      }

      return false;
    }
  }

  /** @private */
  _onRequest(options, done) {
    let [ min, max ] = this._options.delay;

    min = Math.ceil(min);
    max = Math.floor(max);

    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    console.info(`${this._source.name}: request for ${options.uri} (delay = ${delay})`);

    setTimeout(() => done(), delay);
  }

  /** @private */
  _onResponse(error, response, done) {
    if (error) {
      console.error(error);
      return done();
    }

    const { _source: source, _buffer: buffer } = this;
    const { name, model } = source;

    const { statusCode, body, options, $ } = response;
    if (statusCode !== 200) {
      console.warn(`${name}: response for ${options.uri} skipped (${statusCode} status code)`);
      return done();
    }

    if (!body) {
      console.warn(`${name}: response for ${options.uri} skipped (Empty body)`);
      return done();
    }

    let props = {};
    for (let field of Object.entries(model)) {
      const [ name, model ] = field;
      const { selector, type, transform, default: def, } = model;

      let value = $(selector).text().trim();
      value = typeof transform === 'function' ? transform(value) : value;
      value = value || def || null;

      switch (type) {
        case 'integer':
          props[name] = Number.parseInt(value, 10);
          break;
        case 'float':
          props[name] = Number.parseFloat(value);
          break;
        case 'boolean':
          props[name] = Boolean(value);
          break;
        default: // text & etc
          props[name] = value;
          break;
      }
    }

    buffer.push({
      sourceId: name,
      ...props
    });

    console.log(`${name}: response for ${options.uri} processed`);

    done();
  }

  /** @private */
  _onFinish() {
    const { _source: source, _buffer: buffer } = this;
    const filename = path.normalize(source.storage);

    if (!buffer.length)
      return;

    fs.writeFile(filename, JSON.stringify(buffer), (error) => {
      if (error)
        return console.error(error);

      console.info(`${source.name}: parse result saved in ${filename} (${buffer.length} records)`);
    });
  }

}

module.exports = Crawler;