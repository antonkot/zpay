const express = require('express');
const app = express();

const transaction = require('./controllers/transaction');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post('/topup', [
  transaction.checkAccount,
  transaction.checkAmount,
  transaction.topup
]);

app.post('/withdraw', [
  transaction.checkAccount,
  transaction.checkAmount,
  transaction.withdraw
]);

app.post('/transfer', [
  transaction.checkTransfer,
  transaction.checkAmount,
  transaction.transfer
]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
