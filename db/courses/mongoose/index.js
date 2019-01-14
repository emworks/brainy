const mongoose = require('../../').mongoose;

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
    Course: {
        name: 'course',
        model: mongoose.model('Course', courseSchema),
        schema: courseSchema
    }
}