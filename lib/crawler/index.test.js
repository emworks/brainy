const Crawler = require('./');
const workers = process.argv.slice(2);
new Crawler().start(workers.length && workers);