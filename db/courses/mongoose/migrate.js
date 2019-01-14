const mongoose = require('../../').mongoose;
const { Course } = require('./');
const data = require('require-all')('../data');

migrate(Course, Object.keys(data).reduce((memo, key) => memo.concat(data[key]), []));

function migrate(collection, data = [], step = 1000) {
    if (!collection) log('collection is not defined ');
    if (!data.length) log('read data error ');

    const _model = mongoose.model(`_${collection.name}`, collection.schema);

    _insert(_model, data, step)
        .then(length => console.log(`successfully inserted ${length} docs`))
        .catch(err => _log('insert error ', err))
        .then(() => mongoose.connection.db.dropCollection(`${collection.name}s`))
        .catch(err => _log('drop error ', err))
        .then(() => mongoose.connection.db.renameCollection(`_${collection.name}s`, `${collection.name}s`))
        .catch(err => _log('rename error ', err))
        .then(() => process.exit(0));
}

function _log(msg, err) {
    console.error(msg);
    console.error(err);
    process.exit(1);
}

function _insert(model, data, step) {
    if (!_insert.data) {
        _insert.model = model;
        _insert.data = data;
        _insert._length = data.length;
    }

    return Promise.resolve(_insert.model.insertMany(_insert.data.splice(0, step))).then(docs => {
        console.log(`inserted ${docs.length} docs`);
        if (_insert.data.length) {
            return _insert();
        } else {
            const length = _insert._length;
            _insert._length = 0;
            return Promise.resolve(length);
        }
    });
}