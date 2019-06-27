const MongoClient = require("mongodb").MongoClient;

// Create Mongo client
const mongo = new MongoClient(
  process.env.MONGO_URL,
  {useNewUrlParser: true}
);

const dbName = process.env.NODE_ENV == 'test' ? 'zpay_test' : 'zpay';

// Call the cb-function with db instance
async function getDB() {
  // Already connected?
  if (mongo.isConnected()) {
    return mongo.db(dbName);
  } else {
    // Connect to DB
    await mongo.connect();
    return mongo.db(dbName);
  }
}

module.exports = getDB;
