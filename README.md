# Example account-based payment service

## Service architecture

The service contains the following layers:

**API Layer**  
- Handles API requests.  
- Performs authentification and authorization.  
- Validates input: required data, type matches etc.  
- Stores valid transactions to the DB with "pending" status.  
- Sends transaction to the Queue Layer.
- Can be scaled and balanced if needed.  

**Queue Layer**  
- FIFO (first-in first-out) queue (in order to prevent racing conditions).  
- Validates availability of the transaction.  
- Performs available transaction.  
- Saves transaction to the DB.

**Database Layer**  
- Stores information about accounts and transactions.
- Can be replicated if needed.

### Possible improvements

- Make second queue in order to notify clients about transaction updates.
- Use timestamps for double-checking transaction availability.

## How to use

### Prerequisites
- Docker version 18.09.6 or older
- docker-compose version 1.24.0 or older

### Install
1. Clone this repo and navigate to the project root
-  Run services  
```
$ docker-compose up -d
```
API will be available at http://localhost:3000

- Run api tests  
```
$ docker exec -it zpay_api_1 sh -c "npm run test"
```
- Monitor queue worker
```
$ docker-compose up queue
```

## TODO
1. Account creation
- Request authentication and authorization
- More tests
- Refactor using DI for DB and Queue drivers
- Implement real payment gateways. Should use DI for that.

## Roadmap
- [x] Make docker config and install Express, Mongo and Redis
- [x] Implement API
- [x] Implement queue client
- [x] Make tests
