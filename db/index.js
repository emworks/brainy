const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://yy:0verdr1ve@ds141674.mlab.com:41674/edu', {
    useNewUrlParser: true
});

const elasticsearch = new require('elasticsearch').Client({
    host: 'https://osx6ue22xf:dfo7h63ls6@ginkgo-824136165.us-east-1.bonsaisearch.net',
    // host: 'localhost:9200',
    // log: 'trace'
});

module.exports = {
    mongoose: mongoose,
    elasticsearch: elasticsearch
};