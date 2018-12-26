const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://yy:0verdr1ve@ds141674.mlab.com:41674/edu');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sourceId: {
        type: String
    }
}, { timestamps: true });

courseSchema.index({ 
    title: 'text',
    url: 'text',
    description: 'text'
}, { 
    weights: {
        title: 3,
        url: 2,
        description: 1 
    }
});

module.exports = {
    Course: mongoose.model('Course', courseSchema)
}
