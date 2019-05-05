let _add = console.log;

if (process.env.NODE_ENV === 'production') {
    const { Action } = require('../../db/courses/clients/mongoose');

    _add = (message = '', type = 'query', client = '', user = '') => new Action.model({
        message,
        type,
        client,
        user,
        timestamp: new Date().toISOString()
    }).save().catch(err => console.log('logging error: ', err));
}

module.exports = {
    add: _add
};