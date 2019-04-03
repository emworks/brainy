const { Action } = require('../../db/courses/clients/mongoose');

const _add = (message = '', type = 'query', user = '') => Action.model.insert({
    message,
    type,
    user,
    timestamp: new Date().toISOString()
}).catch(err => console.log('logging error: ', err));

module.exports = {
    add: _add
};