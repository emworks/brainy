const db = require('../db/').elasticsearch;
const logger = require('../lib/logger');

const _normalize = ({ 
    _id, 
    _source: { 
        title, 
        url, 
        description, 
        sourceId, 
        dateFrom, 
        rating,
        lang
    } = {}
}) => {
    return ({
        _id, 
        title, 
        url, 
        description, 
        sourceId, 
        dateFrom, 
        rating,
        lang
    })
};

async function _search(body) {
    const data = await db.search({
        index: 'edu',
        body
    });

    return { 
        data: data.hits.hits.map(_normalize)
    };
}

async function _searchByQuery(q = '', size = 10000) {
    const data = await db.search({
        index: 'edu',
        body: {
            query: {
                multi_match: {
                    query: q,
                    fuzziness: 1,
                    fields: [
                        'title^3',
                        'url^2',
                        'description^1'
                    ]
                }
            },
            size,
            sort: [
                { lang: { order: 'desc' }},
                { _score: { order: 'desc' }},
            ]
        }
    });

    return { 
        data: data.hits.hits.map(_normalize)
    };
}

module.exports = app => {
    app.get('/api/esearch', async function (req, res) {
        const { q, client } = req.query;

        logger.add(q, 'query', client);

        const data = await _searchByQuery(q);
        res.send(Object.assign({ q }, data));
    });

    return {
        search: _search,
        searchByQuery: _searchByQuery
    }
};