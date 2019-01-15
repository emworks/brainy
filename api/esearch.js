const db = require('../db/').elasticsearch;

module.exports = app => {
    app.get('/api/esearch', async function (req, res) {
        const { q = '' } = req.query;

        const data = await db.search({
            index: 'edu',
            body: {
                query: {
                    multi_match: {
                        query: q,
                        fields: [
                            'title^3',
                            'url^2',
                            'description^1'
                        ]
                    }
                }
            }
        });

        res.send({ q, data: data.hits.hits.map(({ 
            _id, _source: { title, url, description, sourceId } = {}
        }) => ({
            _id, title, url, description, sourceId
        })) });
    });
};