# Brainy

A search engine for online courses.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/download-center)
- [Elasticsearch](https://www.elastic.co/downloads/elasticsearch)

## Install

```
npm run build
```

## Working with DB

Fill out database with `npm run reindex`. Get fresh courses with `npm run crawl [platform]` and then reindex again. Note that `[platform]` means one of the `lib\crawler\workers` scripts.

## Run

```
npm start
```

Server is listening on http://localhost:3000.