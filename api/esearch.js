const db = require('../db/').elasticsearch;
const logger = require('../lib/logger');

async function _search(body) {
    const data = await db.search({
        index: 'edu',
        body
    });

    return { data: data.hits.hits.map(({ 
        _id, 
        _source: { 
            title, 
            url, 
            description, 
            sourceId, 
            dateFrom, 
            rating 
        } = {}
    }) => ({
        _id, 
        title, 
        url, 
        description, 
        sourceId, 
        dateFrom, 
        rating
    })) };
}

module.exports = app => {
    app.get('/api/esearch', async function (req, res) {
        const { q, client } = req.query;

        logger.add(q, 'query', client);

        const body = {
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
            size: 10000,
            sort: [
                { lang: { order: 'desc' }},
                { _score: { order: 'desc' }},
            ]
        }

        const data = await _search(body);
        res.send(Object.assign({ q }, data));
    });

    return {
        search: _search
    }
};