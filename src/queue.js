const mongo = require("mongodb");
const client = require('./clients/redis');
const account = require('./controllers/account');
const transaction = require('./controllers/transaction');

const queueName =
  process.env.NODE_ENV == 'test' ?
  'transactions_test' :
  'transactions';

async function makeTopup(t) {
  // Get account info
  let a = await account.find(new mongo.ObjectID(t.account_id));
  // Account not found
  if (a == null) {
    // Update transaction
    await transaction.update(t['_id'], {status:'error'});
    console.log('Failed. Account not found');
    return;
  }

  // It's OK. Update account and transaction
  await account.update(a['_id'], t.amount);
  await transaction.update(t['_id'], {status:'complete'});
  console.log('Transaction complete');
}

async function makeWithdraw(t) {
  // Get account info
  let a = await account.find(new mongo.ObjectID(t.account_id));
  // Account not found
  if (a == null) {
    // Update transaction
    await transaction.update(t['_id'], {status:'error'});
    console.log('Failed. Account not found');
    return;
  }
  // Check if enough money to withdraw
  if (a.amount < t.amount) {
    await transaction.update(t['_id'], {status:'error'});
    console.log('Failed. Not enough money');
    return;
  }

  // It's OK. Update account and transaction
  await account.update(a['_id'], -1 * t.amount);
  await transaction.update(t['_id'], {status:'complete'});
  console.log('Transaction complete');
}

async function makeTransfer(t) {
  // Get accounts info
  let from = await account.find(new mongo.ObjectID(t.from_id));
  let to = await account.find(new mongo.ObjectID(t.to_id));
  // Account not found
  if (from == null || to == null) {
    // Update transaction
    await transaction.update(t['_id'], {status:'error'});
    console.log('Failed. Account not found');
    return;
  }
  // Check if enough money to withdraw
  if (from.amount < t.amount) {
    await transaction.update(t['_id'], {status:'error'});
    console.log('Failed. Not enough money');
    return;
  }

  // It's OK. Update account and transaction
  await account.update(from['_id'], -1 * t.amount);
  await account.update(to['_id'], t.amount);
  await transaction.update(t['_id'], {status:'complete'});
  console.log('Transaction complete');
}

function work() {
  // Read first job in the queue
  client.lpop(queueName, async (err, t_id) => {
    // If queue is empty, wait for 3 seconds and try again
    if (t_id == null) {
      setTimeout(work, 3000);
    } else {
      // We got a job!
      console.log("Processing", t_id);

      // Get transaction from DB
      let t = await transaction.find(new mongo.ObjectID(t_id));
      // Quick check for status
      if (t.status != 'pending')
        throw Error('Transacion already complete or failed');

      // Depends on type of transaction
      switch (t.type) {
        case 'topup':
          await makeTopup(t);
          break;
        case 'withdraw':
          await makeWithdraw(t);
          break;
        case 'transfer':
          await makeTransfer(t);
          break;
        default:
          throw Error('Unknown transaction type');
      }

      // get next job
      work();
    }
  });
}

work();
