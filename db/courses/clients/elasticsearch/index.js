const client = require('../../../').elasticsearch;
const data = require('require-all')(__dirname + '/../../data');

migrate(Object.keys(data).reduce((memo, key) => memo.concat(data[key]), []), 'edu');

function migrate(data = [], indexName) {
    const indexNameTmp = indexName + Date.now();

    client.indices.create({ index: indexNameTmp })
        .then(resp => {
            console.log(`successfully created index '${indexName}'`, resp);

            Object.keys(data).forEach(id => {
                try {
                    client.create({
                        index: indexNameTmp,
                        type: 'course',
                        id: id,
                        body: data[id]
                    })
                } catch (e) {
                    console.log(`error adding item ${item}`);
                    console.log(e);
                }
            });
        
            client.indices.deleteAlias({ index: '*', name: indexName })
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