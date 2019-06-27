const getDB = require('../clients/mongo');
const client = require('../clients/redis');

const queueName =
  process.env.NODE_ENV == 'test' ?
  'transactions_test' :
  'transactions';

class Transaction {

  // Check Account ID
  static checkAccount(req, res, next) {
    if (!req.body.account_id) {
      return res.status(400).json({
        "error": "account_id required"
      });
    }
    if (typeof req.body.account_id !== 'string') {
      return res.status(400).json({
        "error": "Invalid account_id"
      });
    }
    next();
  }

  // Check amount
  static checkAmount(req, res, next) {
    if (!req.body.amount) {
      return res.status(400).json({
        "error": "amount is required"
      });
    }
    if (typeof req.body.amount !== 'number') {
      return res.status(400).json({
        "error": "Amount should be a number"
      });
    }
    if (req.body.amount <= 0) {
      return res.status(400).json({
        "error": "Amount should be positive"
      });
    }
    next();
  }

  // Check transfer
  static checkTransfer(req, res, next) {
    if (!req.body.from_id) {
      return res.status(400).json({
        "error": "from_id is required"
      });
    }
    if (!req.body.to_id) {
      return res.status(400).json({
        "error": "to_id is required"
      });
    }
    if (typeof req.body.from_id !== 'string') {
      return res.status(400).json({
        "error": "Invalid from_id"
      });
    }
    if (typeof req.body.to_id !== 'string') {
      return res.status(400).json({
        "error": "Invalid to_id"
      });
    }
    if (req.body.from_id == req.body.to_id) {
      return res.status(400).json({
        "error": "Can not transfer to the same account"
      });
    }
    next();
  }

  // Find transaction by id
  static async find(id) {
    const db = await getDB();
    const collection = db.collection('transactions');
    return collection.findOne({'_id':id});
  }

  // Update transaction by id
  static async update(id, data) {
    const db = await getDB();
    const collection = db.collection('transactions');
    return collection.updateOne({'_id':id}, {$set: data});
  }

  // Save transaction to the database
  static async save(data, res) {
    const db = await getDB();
    const collection = db.collection('transactions');
    data['status'] = 'pending';

    let result = await collection.insertOne(data);
    // Push new job to the queue
    client.rpush(queueName, result.ops[0]['_id'].toString());

    res.status(200).json(result.ops);
  }

  // Make deposit
  static topup(req, res) {
    const data = {
      type: "topup",
      account_id: req.body.account_id,
      amount: req.body.amount
    };
    Transaction.save(data, res);
  }

  // Make withdraw
  static withdraw(req, res) {
    const data = {
      type: "withdraw",
      account_id: req.body.account_id,
      amount: req.body.amount
    };
    Transaction.save(data, res);
  }

  // Make transfer
  static transfer(req, res) {
    const data = {
      type: "transfer",
      from_id: req.body.from_id,
      to_id: req.body.to_id,
      amount: req.body.amount
    };
    Transaction.save(data, res);
  }
}

module.exports = Transaction;
