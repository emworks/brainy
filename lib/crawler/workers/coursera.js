const request = require('request-promise');
const { parseString } = require('xml2js');
const q = require('q');
const cheerio = require('cheerio');
const fs = require('fs');

const ID = 'Coursera';
const URL = 'https://www.coursera.org';
const SITEMAP = `${URL}/sitemap~www~courses.xml`;

const STEP = 10;
const PATH = 'db/courses/data/coursera.json';

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
            let $title = $('#root h1');
            let $description = $('.content-inner');
            let $lang = $('.ProductGlance > div:last-child h4').eq(1);
            let lang = _getLanguageId($lang.text());
            if (!lang) {
                console.log(`Skipping ${$lang.text()} course from ${result[i]}`);
                return;
            }
            getInfo.result.push({
                url: result[i],
                title: $title.eq(1).text(),
                description: $description.text(),
                sourceId: ID,
                lang
            });
        });
    }).catch(console.error).then(() => {
        console.log(`${ID}: ${getInfo.result.length}/${getInfo.result.length + getInfo.data.length}`);
        if (getInfo.data.length) {
            return getInfo();
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

function _getLanguageId(text) {
    return ['English', 'Russian'].indexOf(text) + 1;
}

module.exports = function () {
    return request(SITEMAP).then(xml => parseString(xml, (err, result) => {
        if (err) throw new Error(err);
        const data = result.urlset.url.map(url => url.loc.pop());
        console.log(`Getting information from ${ID}...`);
        console.time(ID);
        return getInfo(data);
    })).catch(console.error);
};