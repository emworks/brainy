const client = require('../../../').elasticsearch;
const data = require('require-all')(__dirname + '/../../data');

const fs = require('fs');
const path = require('path');
const synonyms = fs.readFileSync(path.resolve(__dirname, './dictionaries/synonyms.txt'), 'utf8').split('\r\n');

migrate(Object.keys(data).reduce((memo, key) => memo.concat(data[key]), []), 'edu');

function migrate(data = [], indexName) {
    const indexNameTmp = indexName + Date.now();

    client.indices.create({
        index: indexNameTmp,
        body: {
            settings: {
                analysis: {
                    filter: {
                        synonym_filter: {
                            type: 'synonym',
                            synonyms
                        }
                    },
                    analyzer: {
                        filter_synonyms: {
                            tokenizer: 'standard',
                            filter: [ 'lowercase', 'synonym_filter' ]
                        }
                    }
                }
            }
        }
    })
        .then(resp => {
            console.log(`successfully created index '${indexName}'`, resp);

            return client.indices.putMapping({
                index: indexNameTmp,
                type: 'course',
                body: {
                    properties: {
                        title: {
                            type: 'text',
                            analyzer: 'filter_synonyms'
                        },
                        url: {
                            type: 'text',
                            analyzer: 'filter_synonyms'
                        },
                        description: {
                            type: 'text',
                            analyzer: 'filter_synonyms'
                        },
                        sourceId: { type: 'text' }
                    }
                }
            });
        })
        .then(resp => {
            console.log(`successfully created mapping for '${indexName}'`, resp);

            const body = Object.keys(data).reduce((memo, id) => {
                const { 
                    url, title, description, 
                    sourceId, lang, dateFrom, rating
                } = data[id];
                
                if ('undefined' === typeof url ||
                    'undefined' === typeof title ||
                    'undefined' === typeof description) {
                    return memo;
                }
                
                return memo.concat([
                    { index: { _index: indexNameTmp, _type: 'course', _id: id } },
                    { 
                        url, title, description, 
                        sourceId, lang, dateFrom, rating
                    }
                ]);
            }, []);

            return client.bulk({ body })
        })
        .then(resp => {
            return client.indices.deleteAlias({ index: '*', name: indexName })
                .then(resp => {
                    console.log(`successfully deleted index '${indexName}'`, resp);
                })
                .catch(err => {
                    if (404 !== err.status) {
                        _log(`error deleting index '${indexName}' `, err);
                    }
                })
                .then(() => {
                    client.indices.putAlias({
                        index: indexNameTmp,
                        name: indexName
                    })
                        .then(resp => {
                            console.log('successfully put alias', resp);
                            process.exit(0);
                        })
                        .catch(err => {
                            _log(`error putting alias`, err);
                        });
                });
        })
        .catch(err => {
            _log(`error creating index`, err);
        });
}

function _log(msg, err) {
    console.error(msg);
    console.error(err);
    process.exit(1);
}