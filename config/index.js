module.exports = Object.freeze({
    'token': process.env.TELEGRAM_TOKEN,
    'db.mongo.url': process.env.MONGO_URL || 'mongodb://localhost/brainy',
    'db.elastic.url': process.env.BONSAI_URL || 'localhost:9200'
});