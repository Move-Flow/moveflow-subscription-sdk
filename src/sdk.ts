import { ethers } from 'ethers';
import SubscriptionABI from './lib/contractABIs/subsrciptionABI.json';
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
  GetSubscriptionsResponse,
} from './utils/type';
import { Client } from 'urql';
import { GET_SUBSCRIPTIONS } from './utils/api/queries';

// Ethereum provider URL and contract information
const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
const privateKey = '753e10bc305827ad956b98c178ed80b0c98900d40a6ecec3e05fe373ad9f85a3';

// Create an Ethereum provider and wallet
const provider = new ethers.JsonRpcProvider(infuraUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

// Create a subscription with validation checks
const createSubscription = async (input: CreateSubscriptionInput): Promise<void> => {
  const {
    recipient,
    deposit,
    tokenAddress,
    startTime,
    stopTime,
    interval,
    fixedRate,
  } = input;

  // Validation Checks
  if (!recipient) {
    throw new Error('Recipient is undefined. Please provide a valid recipient address.');
  }

  if (stopTime < startTime) {
    throw new Error('Stop time cannot be earlier than start time.');
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (BigInt(stopTime.toString()) < BigInt(currentTimestamp)) {
    throw new Error('Stop time cannot be in the past.');
  }

  if (BigInt(deposit.toString()) <= BigInt(0)) {
    throw new Error('Deposit amount must be greater than zero.');
  }

  const userBalance = await wallet.provider?.getBalance(wallet.address);
  const depositAmount = ethers.parseEther(deposit.toString());

  if (userBalance && depositAmount && BigInt(userBalance.toString()) < BigInt(depositAmount.toString())) {
    throw new Error('User balance is insufficient to create the subscription.');
  }

  // Create the subscription
  try {
    await contract.createSubscription(
      recipient,
      deposit,
      tokenAddress,
      startTime,
      stopTime,
      interval,
      fixedRate
    );

    console.log('Transaction successful: createSubscription');
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw new Error('Failed to create subscription. Please check the input and try again.');
  }
};

// Retrieve subscription details
const getSubscription = async (subscriptionId: BigInt): Promise<GetSubscriptionOutput> => {
  try {
    return await contract.getSubscription(subscriptionId);
  } catch (error) {
    console.error('Error in getSubscription:', error);
    throw new Error('Failed to get subscription details. Please try again later.');
  }
};

// Deposit funds from the sender
const depositFromSender = async (input: DepositFromSenderInput): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    return await contract.depositFromSender(subscriptionId, amount);
  } catch (error) {
    console.error('Error in depositFromSender:', error);
    throw new Error('Failed to deposit from sender. Please check the input and try again.');
  }
};

// Withdraw funds from the recipient
const withdrawFromRecipient = async (input: WithdrawFromRecipientInput): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    return await contract.withdrawFromRecipient(subscriptionId, amount);
  } catch (error) {
    console.error('Error in withdrawFromRecipient:', error);
    throw new Error('Failed to withdraw from recipient. Please check the input and try again.');
  }
};

// List subscriptions
const listSubscriptions = async (client: Client): Promise<GetSubscriptionsResponse> => {
  try {
    const response = await client.query(GET_SUBSCRIPTIONS, {}).toPromise();
    if (response.error) {
      console.error('Error fetching subscriptions:', response.error);
      throw new Error('Failed to fetch subscriptions.');
    }
    console.log('Data fetched successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw new Error('Failed to fetch subscriptions.');
  }
};

export {
  createSubscription,
  getSubscription,
  depositFromSender,
  withdrawFromRecipient,
  listSubscriptions,
};
