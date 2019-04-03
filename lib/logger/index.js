const { Action } = require('../../db/courses/clients/mongoose');

module.exports = app => {
    const _add = (message = '', type = 'query', user = '') => Action.model.insert({
        message,
        type,
        user,
        timestamp: new Date().toISOString()
    }).catch(err => console.log('logging error: ', err));

    return {
        add: _add
    }
};