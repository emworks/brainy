# Brainy

A search engine for online courses.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/ru/docs/install)
- [MongoDB](https://www.mongodb.com/download-center)
- [Elasticsearch](https://www.elastic.co/downloads/elasticsearch)

## Install

```
yarn build
```

## Working with DB

Fill out database with `yarn reindex`. Get fresh courses with `yarn crawl [platform]` and then reindex again. Note that `[platform]` means one of the `lib\crawler\workers` scripts.

## Run

```
yarn start
```

Server is listening on http://localhost:3000.