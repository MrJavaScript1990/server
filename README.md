A Node.js Server to provide api for Client.

Live demo on Heroku:

**https://crypto-server-nparooei.herokuapp.com/**

Video on Youtube

**https://youtu.be/TauO8qca4KM**

To run it on localhost:

1.  clone the server project 
    **https://github.com/MrJavaScript1990/server** 
    it will run by default on **http://localhost:5000**
    go to folder of the project and run 
    
    `yarn`
    
    `yarn start `

2.  clone client project 
    **https://github.com/MrJavaScript1990/www-client**
    it will run by default on **http://localhost:3000**
    go to folder of the project and run 
    
    `yarn`
    
    `yarn start ` 
    
3.  both Redis and MongoDB databases are remote so no further 
    configuration needed
    
4.  Navigate to **http://localhost:3000**


What I did use :

Client : `react` `redux` `axios`

Server : `node.js` `express` `kue` `redis` `mongoDB` 


# Description
# What is this WebApp


1. Model and structure the following data in a "database" of your choice
	a. User - should consist of at least the following fields
		- Identifier
		- Name (max length is 512 characters)
		- Description (max length is 1k characters)
		- E-Mail (max length is 1k characters)
		- Bitcoin Wallet Id (max length of Bitcoin Wallet Id)
		- Bitcoin Wallet balance (max value 1 bln)
		- Ethereum Wallet Id (max length of Ethereum Wallet Id)
		- Ethereum Wallet balance (max value 1 bln)
		- Max amount that is allowed per transaction
	b. Transaction
		- Identifier
		- Currency Amount
		- Currency Type
		- Source user id
		- Target user id
		- Timestamp created
		- Timestamp processed
		- State
		
2. Implement a backend service that provides the following endpoints / handlers
	a. Create user (with basic user details)
		- Validate and store details in the database
	b. Add currency account for currency (Bitcoin, Ethereum)
		- Validate and set account details
	c. Submit transaction to system
		- Put the transaction into the transaction processor queue and return its transaction id		
	d. Retrieve transaction history for user id
		- Retrieve list of all the processed transactions and their state, each entry consisting of amount, source user id, target user id and currency type
	e. Retrieve transaction status
		
3. Implement a transaction processor that can run in parallel to the backend service and processes transactions (e.g. worker, job system, script, ...)
	a. Users will submit transactions, specifying how much of a certain currency they want to send to another user. The processor needs to make sure that:
		- Transactions must happen in the order that they were submitted
		- Each transaction should only be executed once
		- No transactions should be missed
		- Transactions should be processed as soon as possible, but there is no hard requirement
	b. The processor should implement at least the following steps for each transaction in the queue
		- Validate that the transaction can be processed (user A has enough of currency type and amount, etc. ...)
		- Process the transaction: 
			* Amount of correct type should be subtracted from sending user
			* Amount of correct type should be added to target user
			* Adjust transaction state
		- Transaction details should be logged
		- At least the transaction (id) is saved to the transaction history of both users

3. Protect all public endpoints against unauthorised access in some way.

4. Create a simple website/webpage/application that uses the previously defined endpoints of the backend and lets the user enter the required information and/or display information according to the endpoint.

