const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(
  process.env.MONGO_URL,
  {useNewUrlParser: true}
);
 
mongoClient.connect(function(err, client) {
  console.log('Connected to mongo');
});

app.get('/', (req, res) => {
  return res.send('Hello world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
