const getDB = require('../clients/mongo');

class Account {

  // Find account
  static async find(id) {
    const db = await getDB();
    const collection = db.collection('accounts');
    return collection.findOne({'_id':id});
  }

  // Deposit or withdraw from account
  // Positive amount for topup, negative for withdraw
  static async update(id, amount) {
    const db = await getDB();
    const collection = db.collection('accounts');
    return collection.updateOne({'_id':id}, {$inc: {amount: amount}});
  }
}

module.exports = Account;
