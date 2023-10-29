# Moveflow Subscription SDK

Moveflow Subscription SDK is a TypeScript SDK for interacting with Ethereum smart contracts related to subscription management. It provides a set of functions to create, manage, and retrieve subscription details. This README provides an overview of the functions and their use cases.

## Installation
```
npm install --save  moveflow-subscription/sdk
# or
yarn add  moveflow-subscription/sdk
```

To use this SDK in your project, you can install it via npm:

## Initialization

To get started, you'll need to initialize the SDK with your Ethereum provider URL and contract information. The following code snippet demonstrates how to do this:

```
typescript
const contractAddress = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
const privateKey = "your_private_key_here";
const chain = Chain.Sepolia; // Set the chain (e.g., Sepolia, Goerli)

// Step 1: Initialize an Ethereum provider
const provider = initializeProvider(chain);

// Step 2: Create a wallet with your private key and provider
const wallet = new ethers.Wallet(privateKey, provider);

// Step 3: Create an instance of the smart contract
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

```


## Usage 
The SDK provides several functions for managing subscriptions. Here's how to use them:

### CreateSubscription 
```
/**
 * Create a subscription with validation checks.
 *
 * @param {CreateSubscriptionInput} input - The input data for creating the subscription.
 * @throws {Error} Throws an error if validation checks fail or the subscription creation fails.
 */
const createSubscription = async (input: CreateSubscriptionInput): Promise<void> => {
  // ... code ...
};

// Example usage:
const subscriptionData = {
  recipient: "0xRecipientAddress",
  deposit: 1, // Deposit amount in ETH
  tokenAddress: "0xTokenAddress",
  startTime: 1644043200, // Start time in Unix timestamp
  stopTime: 1646645200, // Stop time in Unix timestamp
  interval: 60, // Subscription interval in seconds
  fixedRate: 0.05, // Fixed rate as a float
};

createSubscription(subscriptionData);

```

##### Parameters:

input (Type: CreateSubscriptionInput): The input data for creating the subscription.
Input Fields:

recipient (Type: string): The recipient's address for the subscription.

deposit (Type: number): The deposit amount for the subscription.

tokenAddress (Type: string): The address of the token for the subscription.(ERC-20)

startTime (Type: number): The start time of the subscription.

stopTime (Type: number): The stop time of the subscription.

interval (Type: number): The interval for the subscription.

fixedRate (Type: string): The fixed rate for the subscription.

##### Description:
This method allows you to create a subscription contract with various parameters, while performing validation checks on the input data. It ensures that the provided data is valid and that the user's balance is sufficient to create the subscription.



### depositeFromSender

```
/**
 * Deposit funds from the sender to a subscription.
 *
 * @param {DepositFromSenderInput} input - The input data for depositing funds.
 * @returns {Promise<boolean>} Returns `true` if the deposit was successful.
 * @throws {Error} Throws an error if validation checks fail or the deposit operation fails.
 */
const depositeFromSender = async (input: DepositFromSenderInput): Promise<boolean> => {
  // ... code ...
};

// Example usage:
const depositData = {
  subscriptionId: 1, // ID of the subscription to deposit to
  amount: 0.1, // Amount to deposit in ETH
};

depositeFromSender(depositData);

```


##### Parameters:

input (Type: DepositFromSenderInput): The input data for depositing funds.
Input Fields:
subscriptionId (Type: number): The ID of the subscription to deposit to.

amount (Type: number): The amount to deposit to the subscription.

##### Description:
This method allows the sender to deposit funds to a specific subscription, performing validation checks on the subscription ID and deposit amount. It also checks if the sender's balance is sufficient for the deposit.





### listSubscriptions: List subscriptions created by a specific sender.




