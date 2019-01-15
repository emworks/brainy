const db = require('../db/').elasticsearch;

module.exports = app => {
    app.get('/api/esearch', async function (req, res) {
        const { q = '' } = req.query;

        const data = await db.search({
            index: 'edu',
            q: q
        });

        res.send({ q, data: data.hits.hits.map(({ 
            _id, _source: { title, url, description, sourceId } = {}
        }) => ({
            _id, title, url, description, sourceId
        })) });
    });
};