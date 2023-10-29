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
