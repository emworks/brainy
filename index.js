const PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => (req.header('x-forwarded-proto') !== 'https') 
        ? res.redirect(`https://${req.header('host')}${req.url}`) 
        : next()
    );
}

app.use(express.static(__dirname + '/client/public'));

app.set('views', path.join(__dirname, 'client/public/views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});

// require('./api/search')(app);
const esearch = require('./api/esearch')(app);

if (process.env.NODE_ENV === 'production') {
    require('./lib/bot/telegram')({ esearch });
}

require('./routes')({ app, esearch });

const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server is listening on port ${server.address().port}`));