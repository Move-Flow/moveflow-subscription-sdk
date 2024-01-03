## MoveFlow Subscription SDK

Moveflow Subscription SDK is a TypeScript SDK for interacting with Ethereum smart contracts related to subscription management. It provides a set of functions to create, manage, and retrieve subscription details. This README provides an overview of the functions and their use cases.

### Installation

To use this SDK in your app, you'll need to install it via npm or yarn.
    
    `npm install --save  @moveflow/sdk-evm`

or

    `yarn add  @moveflow/sdk-evm`

### Intitialization

To get started, you'll need to initialize the SDK with your Ethereum provider URL and contract information. The following code snippet demonstrates how to do this:


```js
const contractAddress = "0xF6F48D9F9220C2a30d070e5011817Cc87Ca33f87";
const privateKey = "your_private_key_here";
const chain = Chain.Lightlink_Testnet; 

// Set the chain (e.g., Sepolia, Goerli, Lightlink_Testnet)

// Step 1: Initialize an Ethereum provider
const provider = initializeProvider(chain);

// Step 2: Create a wallet with your private key and provider
const wallet = new ethers.Wallet(privateKey, provider);

// Step 3: Create an instance of the smart contract
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);
```
    
### Write Operation
    
#### 1. Create Subscription
This method allows users to create a subscription contract with various parameters, while performing validation checks on the input data. It ensures that the provided data is valid and that the user's balance is sufficient to create the subscription.

```js
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

try {
    await createSubscription(subscriptionData);
} catch (error) {
    //...
}
```

CreateSubscriptionInput is the input data for creating the subscription. Include fields:
- recipient (string): The recipient's address for the subscription.
- deposit (number): The deposit amount for the subscription.
- tokenAddress (string): The ERC-20 address of the token for the subscription.
- startTime (number): The start time of the subscription.
- stopTime (number): The stop time of the subscription.
- interval (number): The interval for the subscription.
- fixedRate (string): The fixed rate for the subscription.

#### 2. Deposit Funds from sender

This method allows the sender to deposit funds to a specific subscription, performing validation checks on the subscription ID and deposit amount. It also checks if the sender's balance is sufficient for the deposit.

```js
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

try {
        await depositeFromSender(depositData);
} catch (error) {
        //...
}
```

DepositFromSenderInput is the input data for depositing funds. Include fields:
- subscriptionId (number): The ID of the subscription to deposit to.
- amount (number): The amount to deposit to the subscription.

#### 3. Withdraw Funds from Recipient
This method initiates a withdrawal from the recipient's side of the subscription. It validates the subscription ID and withdrawal amount, ensuring they are valid and positive.

```js
/**
 * Withdraw funds from the recipient's side of the subscription.
 *
 * @param {WithdrawFromRecipientInput} input - The input data for withdrawal.
 * @returns {Promise<boolean>} Returns `true` if the withdrawal was successful.
 * @throws {Error} Throws an error if validation checks fail or the withdrawal operation fails.
 */
const withdrawFromRecipient = async (input: WithdrawFromRecipientInput): Promise<boolean> => {
  // ... code ...
};

// Example usage:
const withdrawalData = {
  subscriptionId: 1, // ID of the subscription to withdraw from
  amount: 0.05, // Amount to withdraw in ETH
};

try {
        await withdrawFromRecipient(withdrawalData);
} catch (error) {
        //...
}

```

WithdrawFromRecipientInput is the input data for withdrawing funds. Include fields:
- subscriptionId (number): The ID of the subscription to withdraw tokens from.
- amount (number): The amount of tokens to withdraw.

### 4. Cancel a Subscription
This method allows the sender or recipient to cancel a subscription. Before canceling a subscription, the recipient must have completed all withdrawals. After canceling the subscription, any remaining funds will be refunded to the sender.


```js
/**
 * Cancel the subscription.
 *
 * @param {subscriptionId} input - The Subscription id.
 * @returns {Promise<boolean>} Returns `true` if the withdrawal was successful.
 * @throws {Error} Throws an error if validation checks fail or the withdrawal operation fails.
 */
const cancelSubscription = async (input: subscriptionId): Promise<boolean> => {
  // ... code ...
};

// Example usage:
const specificSubscriptionId = "your subscription id";

try {
    const result = await cancelSubscription(BigInt(specificSubscriptionId));
} catch (error) {
  // ...
}
```

- subscriptionId(number): subscriptionId is the only input field. The ID of the subscription to cancel.


### Query subscription API (Comming Soon)

#### 1. List subscriptions of the specific sender
The API list subscriptions created by a specific sender. The query API supports paginate.

```js
const senderSubscriptionData = await listSenderSubscriptions(
    "Lightlink-testnet",
    "0xSenderAddress",
    10,            //first
    "startTime",  //orderBy: startTime or stopTime
    0,        //skip
    "asc"    //asc or desc
);
const subscriptions = senderSubscriptionData.subscriptionLists;
```

The input parameters for list subscriptions created by a specific sender include:
- chainType: the name of chain, for example goeli.
- sender: the address of sender.
- first: the limit number in current query.
- orderby: can be startTime or stopTime.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

#### 2. List subscription of the specific recipient
The API list subscriptions received by a specific recipient. The query API supports paginate.

```js

const recipientSubscriptionData = await listRecipientSubscriptions(
    "Lightlink-testnet",
    "0xRecipientAddress",
    10,            //first
    "startTime",  //orderBy: startTime or stopTime
    0,        //skip
    "asc"    //asc or desc
);

```

const subscriptions = recipientSubscriptionData.subscriptionLists;
The input parameters for list subscriptions received by a specific recipient include:
- chainType: the name of chain, for example goeli.
- recipient: address of recipient.
- first: the limit number in current query.
- orderby: can be startTime or stopTime.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

#### 3. Query the logs of deposit from sender in the specific subscription
The API queries the logs of deposit from sender in the specific subscription. The query API supports paginate.


```js
const response = await getSenderDepositLog(
    "Lightlink-testnet",
    "subscriptionId",
    10,
    0,
    "depositeTime",
    "asc"
);
const senderDepositeLog = response.subscriptionList.senderDepositeLog;

```

the input param for query the logs of deposit from sender in the specific subscription include:
- chainType: the name of chain,  for example goeli.
- subscriptionId: ID of subscription.
- first: the limit number in current query.
- orderby: can be depositeTime or depositeAmount.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

#### 4. Query the logs of withdraw from recipient in the specific subscription
The API queries the logs of deposit from recipient in the specific subscription. The query API supports paginate.

```js
const response = await getWithdrawFromRecipientLog(
    "Lightlink-testnet",
    "subscriptionId",
    10,
    0,
    "withdrawTime",
    "asc"
);

const subscriptionList = response.subscriptionList?.senderWithdrawLog;

```

The input param for querying the logs of deposit from recipient in the specific subscription include:
- chainType: the name of chain, for example goeli.
- subscriptionId: ID of subscription.
- first: the limit number in current query.
- orderby: can be withdrawTime or withdrawAmount.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

#### 5. Query the overall of sender
The API queries the overall of sender.
```js
const response: GetSenderInfoData = await getSenderInfo(
    "Lightlink-testnet",
    "0xSenderAddress"
);

const senderInfo = response.sender;

```

the input parameters include:
- chainType: the name of chain, for example goeli.
- sender: the address of sender.

#### 6. Query the overall of recipient
The API queries the overall of recipient.

```js
const response: GetRecipientInfoData = await getRecipientInfo(
    "Lightlink-testnet",
    "0xRecipientAddress"
);

const recipientInfo = response.recipient;

```
the input parameters include:
- chainType: the name of chain, for example goeli.
- recipient: the address of recipient.

#### 7. Query all logs of deposit from a specific sender
The API queries all logs of deposit from a specific sender. The query API supports paginate.
```js
const response = await getSenderDepositLogAll(
    mockClient,
    "0xSenderAddress",
    10,
    0,
    "depositeTime",
    "asc"
);

const depositLogs = response.sender.senderDepositeLog;


```

the input parameters include:
- chainType: the name of chain, for example goeli.
- sender: the address of sender.
- first: the limit number in current query.
- orderby: can be depositeTime or depositeAmount.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

#### 8. Query all logs of withdraw from a specific recipient
The API queries all logs of withdrawal from a specific recipient. The query API supports paginate.

```js
const response = await getRecipientWithdrawLog(
    mockClient,
    "0xRecipientAddress",
    10,
    0,
    "withdrawTime",
    "asc"
);

const withdrawalLogs = response.recipient.recipientWithdrawLog;

```

the input parameters include:
- chainType: the name of chain, for example goeli.
- recipient: the address of recipient.
- first: the limit number in current query.
- orderby: can be withdrawTime or withdrawAmount.
- skip: the skip number in current query.
- orderdirection: can be asc or desc

