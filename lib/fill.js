const fs = require('fs');

const { Course } = require('../db');

const { id, items = [] } = require('../db/data/resource/coursera.json');

const STEP = 1000;

Course.remove({}, function (err) {
    if (err) {
        console.log('error removing docs: ', err);
        process.exit(1);
    }
    return insertDocs(items);
});

function insertDocs(data) {
    if (!insertDocs.data) {
        insertDocs.data = data;
    }

    const d = insertDocs.data.splice(0, STEP);

    return Course.insertMany(d.map(({ 
        title, url, description 
    }) => ({ 
        title, url, description, sourceId: id 
    })), function (err, docs) {
        if (err) {
            console.log('error adding docs: ', err);
            process.exit(1);
        }

        if (insertDocs.data.length) {
            console.log(`inserted ${docs.length} docs`);
            return insertDocs();
        } else {
            console.log(`done`);
        }

        process.exit(0);
    });
}