const MongoClient = require("mongodb").MongoClient;

// Create Mongo client
const mongo = new MongoClient(
  process.env.MONGO_URL,
  {useNewUrlParser: true}
);

const dbName = process.env.NODE_ENV == 'test' ? 'zpay_test' : 'zpay';

// Call the cb-function with db instance
function getDB(callback) {
  // Already connected?
  if (mongo.isConnected()) {
    callback(mongo.db(dbName));
  } else {
    // Connect to DB
    mongo.connect(function(err, client) {
      if (err) {
        throw err;
      }
      callback(client.db(dbName));
    });
  }
}

module.exports = getDB;
