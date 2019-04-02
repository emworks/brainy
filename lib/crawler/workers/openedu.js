const request = require('request-promise');
const { parseString } = require('xml2js');
const q = require('q');
const cheerio = require('cheerio');
const fs = require('fs');

const ID = 'Открытое образование';
const URL = 'https://openedu.ru';
const SITEMAP = `${URL}/sitemap.xml`;

const STEP = 1;
const PATH = 'db/courses/data/openedu.json';

const REGEXP_COURSE_URL = /^https:\/\/openedu\.ru\/course\//;

function getInfo(data) {
    if (!getInfo.data) {
        getInfo.data = data;
    }

    if (!getInfo.result) {
        getInfo.result = [];
    }

    let promises = [];
    let params = [];

    const d = getInfo.data.splice(0, STEP);

    for (let i = 0; i < d.length; i++) {
        const uri = d[i];
        promises.push(request({ uri, transform: body => cheerio.load(body) }));
        params.push(uri);
    }

    return q.all(promises.concat(params)).then(result => {
        const pages = result.splice(0, result.length / 2);
        pages.map(($, i) => {
            let $title = $('h1.course-title');
            let $description = $('.description');
            let $dateFrom = $('.course-date .dropdown > span');
            getInfo.result.push({
                url: result[i],
                title: $title.text(),
                description: $description.text(),
                sourceId: ID,
                lang: 2, // Russian
                dateFrom: $dateFrom.text().trim()
            });
        });
    }).catch(console.error).then(() => {
        console.log(`${ID}: ${getInfo.result.length}/${getInfo.result.length + getInfo.data.length}`);
        if (getInfo.data.length) {
            const timeout = (Math.floor(Math.random() * 10) + 1) * 1000;
            return setTimeout(getInfo, timeout);
        } else {
            console.log(`Saving ${getInfo.result.length} entries from ${ID}...`);
            const data = JSON.stringify(getInfo.result);
            return fs.writeFile(PATH, data, err => {
                getInfo.result = [];
                if (err) throw new Error(err);
                console.log(`${PATH} was saved!`);
                console.timeEnd(ID);
            });
        }
    }).catch(console.error);
}

module.exports = function () {
    return request(SITEMAP).then(xml => parseString(xml, (err, result) => {
        if (err) throw new Error(err);
        const data = result.urlset.url.map(url => url.loc.pop()).filter(url => REGEXP_COURSE_URL.test(url));
        console.log(`Getting information from ${ID}...`);
        console.time(ID);
        return getInfo(data);
    })).catch(console.error);
};