const mongoose = require('../../../').mongoose;

// const courseSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     url: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String
//     },
//     sourceId: {
//         type: String
//     }
// }, { timestamps: true });

// courseSchema.index({ 
//     title: 'text',
//     url: 'text',
//     description: 'text'
// }, { 
//     weights: {
//         title: 3,
//         url: 2,
//         description: 1 
//     }
// });

const actionSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: String,
    client: String,
    user: String,
    timestamp: String
});

module.exports = {
    // Course: {
    //     name: 'course',
    //     model: mongoose.model('Course', courseSchema),
    //     schema: courseSchema
    // },
    Action: {
        name: 'action',
        model: mongoose.model('Action', actionSchema),
        schema: actionSchema
    }
};