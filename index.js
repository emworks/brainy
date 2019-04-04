const PORT = process.env.PORT || 3000;

const express = require('express');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => (req.header('x-forwarded-proto') !== 'https') 
        ? res.redirect(`https://${req.header('host')}${req.url}`) 
        : next()
    );
}

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

// require('./api/search')(app);
const esearch = require('./api/esearch')(app);

require('./lib/bot/telegram')({ esearch });

require('./routes')({ app, esearch });

app.listen(PORT);