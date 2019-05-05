const config = require('../config');

let db = {};

if (process.env.NODE_ENV === 'production') {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    mongoose.connect(config['db.mongo.url'], {
        useNewUrlParser: true
    });
    db.mongoose = mongoose;
}

db.elasticsearch = new require('elasticsearch').Client({
    host: config['db.elastic.url'],
    requestTimeout: 60000
});

module.exports = db;