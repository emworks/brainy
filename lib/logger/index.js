const { Action } = require('../../db/courses/clients/mongoose');

const _add = (message = '', type = 'query', user = '') => new Action.model({
    message,
    type,
    user,
    timestamp: new Date().toISOString()
}).save().catch(err => console.log('logging error: ', err));

module.exports = {
    add: _add
};