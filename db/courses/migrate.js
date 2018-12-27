const migrate = require('../migrate');

const { Course } = require('./');
const data = require('require-all')(__dirname + '/data');

migrate(Course, Object.keys(data).reduce((memo, key) => memo.concat(data[key]), []));