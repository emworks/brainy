module.exports = ({ app, esearch: { search } }) => {
    app.get('/compare', async function (req, res) {
        const body = {
            query: {
                ids: {
                    values: req.query.course_id
                }
            }
        };
        const data = await search(body);
        res.send(data);
    });
};