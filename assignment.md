## Z-Pay Backend Test Case 

**Note: The overall architecture vision is necessary. Following that a partial implementation is required.**

Using any libraries/databases etc create a simple account-based payment service with REST API. 

This service will have basic endpoints:

1. Account Topup
```
/topup {
	"account_id": "",
	"amount": 123,
}
```
2. Account Withdraw
```
/withdraw {
	"account_id": "",
	"amount": 123
}
```
3. Transfer between account A and account B
```
/transfer {
	"from_id": "",
	"to_id": "",
	"amount": 123
}
```

The goal is to create a racing-condition-proof system that would prevent account being overdrafted by design.   
