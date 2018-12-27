class Crawler {
    constructor(workersDir = __dirname + '/workers') {
        this.workers = require('require-all')(workersDir);
    }

    start() {
        Object.keys(this.workers).forEach(key => {
            const fn = this.workers[key];
            if ('function' !== typeof fn) {
                console.log(`worker ${key} must be a function`);
                return;
            }
            fn();
        })
    }
}

module.exports = Crawler;