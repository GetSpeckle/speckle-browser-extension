
# Development action items

### Milestone 1: Account Management

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

### Milestone 2: Asset Dashboard

* Create asset dashboard component and UI
  * Display balance
  * Display account info
* Get asset balance by RPC call

### Milestone 3: Transaction Management

* Create UI for send testnet DOTs
* Call API to send testnet DOTs
* Create UI to show the result of the send (success and wrong)
* Create UI to show the address for receiving test-net DOTs and also show the QR Code
* Create UI to display the transaction history of the account (receive/send)
* Call API to retrieve the transaction history from the testnet
* Create a staking UI to show the current validator list
* Make sure the UI and the function works on Chrome, Firefox, Brave 

### Milestone 4: Message Signing

* Create message signing UI and function

