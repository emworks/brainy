const express = require('express');

const app = express();

app.get('/', function (req, res) {
    res.send('Curiosity for all');
});

require('./api/search')(app);

app.listen(3000, () => console.log('listening on http://localhost:3000'));