const os = require('os');
const fs = require('fs');
const path = require('path');

var Sitemap = require('sitemapper');
var Crawler = require('crawler');

const defaultConfig = Object.freeze({
  userAgent: 'Brainybot',
  requestConcurrency: os.cpus().length,
  requestInterval: 200,
  forceUtf8: true,
  skipDuplicates: true,
  normalizeWhitespace: true,
  decodeEntities: true,
});

class Spider {

  constructor(config) {
    if (!config.source)
      throw new TypeError('source ID is not present');

    if (!config.log)
      throw new TypeError('log file name is not present');

    if (!config.elements)
      throw new TypeError('elements for parsing is not present');

    config = Object.assign(config, defaultConfig);

    this._buffer = [];
    this._config = config;
    this._crawler = new Crawler({
      userAgent: config.userAgent,
      maxConnections: config.requestConcurrency,
      forceUtf8: config.forceUtf8,
      skipDuplicates: config.skipDuplicates,
      jQuery: {
        name: 'cheerio',
        options: {
          normalizeWhitespace: config.normalizeWhitespace,
          decodeEntities: config.decodeEntities
        }
      },
      preRequest: this._onRequest.bind(this),
      callback: this._onResponse.bind(this)
    });

    this._crawler.on('drain', function () {
      const { log: filename } = this._config;
      const buffer = this._buffer;

      fs.writeFile(path.normalize(filename), JSON.stringify(buffer), (error) => {
        if (error)
          throw error;
      });
    }.bind(this));
  }

  /** @public */
  start(urls, timeout) {
    const config = this._config;
    const crawler = this._crawler;

    if (urls)
      return crawler.queue(urls);

    const { sitemapUrl } = config;
    const sitemap = new Sitemap({ url: sitemapUrl, timeout });

    sitemap.fetch()
      .then(({ sites: urls }) => crawler.queue(urls))
      .catch((error) => console.error(error));
  }

  /** @private */
  _onRequest(options, done) {
    const { requestInterval: interval } = this._config;
    setTimeout(() => done(), typeof interval === 'number' ? interval : interval());
  }

  /** @private */
  _onResponse(error, response, done) {
    if (error) {
      console.error(error);
      return done();
    }

    const { statusCode, options } = response;
    if (statusCode !== 200) {
      console.warn(`Skip ${options.uri}... => ${statusCode} status code`);
      return done();
    }

    const { courseUrlRegExp } = this._config;
    if (courseUrlRegExp && !courseUrlRegExp.test(options.uri)) {
      console.info(`Skip ${options.uri}... => URL not match`);
      return done();
    }

    const { source, elements} = this._config;
    const fields = Object.entries(elements);
    const buffer = this._buffer;
    const { $ } = response;

    let entry = {
      sourceId: source
    };

    for (let i = 0, n = fields.length; i < n; ++i) {
      const [ element, model ] = fields[i];
      const value = $(model.selector).text().trim();

      switch (model.type) {
        case 'integer':
          entry[element] = Number.parseInt(value, 10);
          break;
        case 'float':
          entry[element] = Number.parseFloat(value);
          break;
        default: // text & etc
          entry[element] = value;
          break;
      }

      buffer.push(entry);
      console.log(`Save ${options.uri}`);

      done();
    }
  }

}
