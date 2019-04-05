const pdf = require('html-pdf');
const logger = require('../../lib/logger');

module.exports = ({ app, esearch: { search } }) => {
    app.get('/export', async function (req, res) {
        const { q, client } = req.query;

        logger.add(`${q}:${req.query.course_id.join(',')}`, 'export', client);

        const body = {
            query: {
                ids: {
                    values: req.query.course_id
                }
            }
        };

        const { data } = await search(body);

        res.render('export', { q, data }, (err, html) => {
            if (err) throw new Error(err);

            pdf.create(html).toStream((err, stream) => {
                if (err) throw new Error(err);

                res.set('Content-Disposition', `inline; filename=brainy_export_${Date.now()}.pdf`);
                res.set('Content-Type', 'application/pdf');

                stream.pipe(res);
            });
        });
    });
};