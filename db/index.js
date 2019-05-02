const config = require('../config');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config['db.mongo.url'], {
    useNewUrlParser: true
});

const elasticsearch = new require('elasticsearch').Client({
    host: config['db.elastic.url'],
    requestTimeout: 60000
});

module.exports = {
    mongoose: mongoose,
    elasticsearch: elasticsearch
};