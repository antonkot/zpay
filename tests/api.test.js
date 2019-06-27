// Set testing environment
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;

// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/api');

// Configure chai
chai.use(chaiHttp);
chai.should();

// Deposit tests
describe("/topup", () => {

  it("Should deposit amount to account", done => {
    let payload = {
      "account_id": "someID",
      "amount": 100
    };
    chai.request(app)
      .post('/topup')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it("Should NOT deposit amount to empty account", done => {
    let payload = {
      "amount": 100
    };
    chai.request(app)
      .post('/topup')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT deposit empty amount to account", done => {
    let payload = {
      "account_id": "someID"
    };
    chai.request(app)
      .post('/topup')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT deposit negative amount to account", done => {
    let payload = {
      "account_id": "someID",
      "amount": -1
    };
    chai.request(app)
      .post('/topup')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT deposit non-numeric amount to account", done => {
    let payload = {
      "account_id": "someID",
      "amount": "alotofmoney"
    };
    chai.request(app)
      .post('/topup')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

// Withdrawal tests
describe("/withdraw", () => {
  it("Should withdraw amount from account", done => {
    let payload = {
      "account_id": "someID",
      "amount": 100
    };
    chai.request(app)
      .post('/withdraw')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it("Should NOT withdraw amount from empty account", done => {
    let payload = {
      "amount": 100
    };
    chai.request(app)
      .post('/withdraw')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT withdraw empty amount from account", done => {
    let payload = {
      "account_id": "someID",
    };
    chai.request(app)
      .post('/withdraw')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT withdraw non-numeric amount from account", done => {
    let payload = {
      "account_id": "someID",
      "amount": "alotofmoney"
    };
    chai.request(app)
      .post('/withdraw')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});

// Transfer tests
describe("/transfer", () => {
  it("Should transfer amount from from_id to_id", done => {
    let payload = {
      "from_id": "someID",
      "to_id": "someAnotherID",
      "amount": 100
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it("Should NOT transfer amount to the same account", done => {
    let payload = {
      "from_id": "someID",
      "to_id": "someID",
      "amount": 100
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT transfer amount from empty account", done => {
    let payload = {
      "to_id": "someID",
      "amount": 100
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT transfer amount to empty account", done => {
    let payload = {
      "from_id": "someID",
      "amount": 100
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT transfer empty amount", done => {
    let payload = {
      "from_id": "someID",
      "to_id": "someID"
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it("Should NOT transfer non-numeric amount", done => {
    let payload = {
      "from_id": "someID",
      "to_id": "someID",
      "amount": "alotofmoney"
    };
    chai.request(app)
      .post('/transfer')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});
