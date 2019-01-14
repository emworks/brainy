const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://yy:0verdr1ve@ds141674.mlab.com:41674/edu', {
    useNewUrlParser: true
});

const elasticsearch = new require('elasticsearch').Client({
    host: 'localhost:9200',
    // log: 'trace'
});

module.exports = {
    mongoose: mongoose,
    elasticsearch: elasticsearch
};