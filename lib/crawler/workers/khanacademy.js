const request = require('request-promise');
const { parseString } = require('xml2js');
const q = require('q');
// const cheerio = require('cheerio');
const fs = require('fs');

const ID = 'Khan Academy';
const URL = 'https://www.khanacademy.org/';
const SITEMAP = `${URL}/sitemap.xml`;

const STEP = 10;
const PATH = 'db/courses/data/khanacademy.json';

function getInfo(data) {
    if (!getInfo.data) {
        getInfo.data = data;
    }

    if (!getInfo.result) {
        getInfo.result = {};
    }

    let promises = [];
    let params = [];

    const d = getInfo.data.splice(0, STEP);

    for (let i = 0; i < d.length; i++) {
        const uri = d[i];
        promises.push(request({ 
            uri, 
            transform: body => new Promise((resolve, reject) => {
                parseString(body, (err, json) => err ? reject(err) : resolve(json));
            })
        }));
        params.push(uri);
    }

    return q.all(promises.concat(params)).then(result => {
        const pages = result.splice(0, result.length / 2);

        pages.map((page, i) => {
            const pageUrl = result[i].split('/').slice(0, 6).join('/');

            return page.urlset.url.map(url => {
                let title = null;
                let description = null;
                let type = null;

                url.PageMap[0].DataObject[0].Attribute.map(attr => {
                    switch (attr.$.name) {
                        case 'title':
                            title = attr._;
                            break;
                        case 'description':
                            description = attr._;
                            break;
                        case 'type':
                            type = attr._;
                            break;                            
                        default: break;
                    }
                });

                if ('subject' === type && title) {
                    if (!getInfo.result[pageUrl]) {
                        getInfo.result[pageUrl] = {
                            description: ''
                        };
                    }

                    getInfo.result[pageUrl].url = pageUrl;
                    getInfo.result[pageUrl].title = title;
                    getInfo.result[pageUrl].sourceId = ID;
                }

                if ('topic' === type && description) {
                    if (!getInfo.result[pageUrl]) {
                        getInfo.result[pageUrl] = {
                            description: ''
                        };
                    }

                    getInfo.result[pageUrl].description += description + '\n';
                }
            })
        });
    }).then(() => {
        const indexes = Object.keys(getInfo.result);
        // console.log(`${ID}: ${indexes.length}/${indexes.length + getInfo.data.length}`);
        if (getInfo.data.length) {
            return getInfo();
        } else {
            console.log(`Saving ${indexes.length} entries from ${ID}...`);
            const data = JSON.stringify(indexes.map(idx => getInfo.result[idx]));
            return fs.writeFile(PATH, data, err => {
                getInfo.result = {};
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
        const data = result.sitemapindex.sitemap.map(url => url.loc.pop());
        console.log(`Getting information from ${ID}...`);
        console.time(ID);
        return getInfo(data.slice(0, 100));
    })).catch(console.error);
};