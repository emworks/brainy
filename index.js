const HOST = process.argv[2] || '127.0.0.1';
const PORT = process.argv[3] || 3000;

const express = require('express');

const app = express();

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

// require('./api/search')(app);
require('./api/esearch')(app);

app.listen(PORT);