const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://yy:0verdr1ve@ds141674.mlab.com:41674/edu', {
    useNewUrlParser: true
});
module.exports = mongoose;