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
        promises.push(request({ uri, transform: (body) => cheerio.load(body) }));
        params.push(uri);
    }

    return q.all(promises.concat(params)).then(result => {
        const pages = result.splice(0, result.length / 2);
        pages.map(($, i) => {
            let $title = $('#root h1');
            let $description = $('.content-inner');
            getInfo.result.push({
                url: result[i],
                title: $title.eq(1).text(),
                description: $description.text(),
                sourceId: ID
            });
        });
    }).then(() => {
        console.log(getInfo.result.length + '/' + (getInfo.result.length + getInfo.data.length));
        if (getInfo.data.length) {
            return getInfo();
        } else {
            console.log('Saving information...');
            return fs.writeFile(PATH, JSON.stringify(getInfo.result), err => {
                getInfo.result = [];
                if (err) throw new Error(err);
                console.log(`${PATH} was saved!`);
            });
        }
    }).catch(console.error);
}

module.exports = function () {
    return request(SITEMAP).then(xml => parseString(xml, (err, result) => {
        if (err)  throw new Error(err);
    
        const data = result.urlset.url.map(url => url.loc.pop());
    
        console.log(`Getting information from ${ID}...`);
    
        return getInfo(data.slice(0, 15));
    })).catch(console.error);
};