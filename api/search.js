const { Course } = require('../db/courses/clients/mongoose');

module.exports = app => {
    app.get('/api/search', function (req, res) {
        const { q = '' } = req.query;

        const params = q ? { $text: { $search: q } } : {};
    
        Course.model.find(params).exec().then(courses => {
            const data = courses.map(({ 
                _id, title, url, description, sourceId 
            }) => ({
                _id, title, url, description, sourceId
            }));

            res.send({ q, data });
        });
    });
};