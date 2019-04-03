const db = require('../db/').elasticsearch;
const logger = require('../lib/logger');

async function _search(query = '', size = 10000) {
    const data = await db.search({
        index: 'edu',
        body: {
            query: {
                multi_match: {
                    query,
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

    return { q: query, data: data.hits.hits.map(({ 
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
        logger.add(req.query.q, 'query', req.query.client);
        const data = await _search(req.query.q);
        res.send(data);
    });

    return {
        search: _search
    }
};