const express = require('express');

const app = express();

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

require('./api/search')(app);

app.listen(3000, () => console.log('listening on http://localhost:3000'));