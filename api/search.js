const { Course } = require('../db');

module.exports = app => {
    app.get('/search', function (req, res) {
        const { q = '' } = req.query;

        const params = q ? { $text: { $search: q } } : {};
    
        Course.find(params).exec().then(courses => {
            const data = courses.map(({ 
                title, url, description, sourceId 
            }) => ({
                title, url, description, sourceId
            }));

            const result = {
                q, data
            };

            res.send(result);
        });
    });
};