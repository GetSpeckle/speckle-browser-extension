
# Development action items

### Account Management

* Setup a new project to support development using react, typescript and webpack. 
  * I18N needs to be supported. 
  * Create a general framework to  support Chrome, Firefox and Brave. 
  * Setup different modules that make up the app.
* Investigate polkadot component library @polkadot/ui-app to find any reusable code and referable design.
* Implement function to create new account with password, which involves: 
  * Create a keypair;
  * Key management of user accounts using @polkadot/keyring, e.g. encrypt/decrypt their private key;
  * Store their private key in local browser storage; 
* Implement function to lock account after an expiry period.
* Implement logout function
* Implement login function 
* Implement function for user to create new keypairs or forget existing keypairs in an account 
* Implement function to backup wallet with keystore file.
* Implement function to backup wallet with seed (mnemonic)

### Asset Dashboard

* Create asset dashboard component and UI
  * Display balance
  * Display account info
* Get asset balance by RPC call

### Transaction Management

* Create react UI for send testnet DOTs
* Implement the API to send testnet DOTs
* Create react UI to show the result of the send (success and wrong)
* Create react UI to show the address for receiving test-net DOTs and also show the QR Code
* Create react UI to display the transaction history of the account (receive/send)
* Implement the API to retrieve the transaction history from the test-net
* Create a staking UI to show the current validator list
* Make sure the UI and the function works on Chrome, Firefox, Brave 

### Message Signing

* Create message signing UI and function

