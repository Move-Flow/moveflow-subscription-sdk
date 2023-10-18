import { ethers, } from 'ethers';
import subscriptionAbi from "./lib/contractABIs/subsrciptionABI.json";
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
} from './utils/type';

const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
const provider = new ethers.JsonRpcProvider(infuraUrl);
// const signer = provider.getSigner();
const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
const contract = new ethers.Contract(contractAddress, subscriptionAbi, provider);
console.log(contract)

const createSubscription = async (input: CreateSubscriptionInput): Promise<void> => {
  try {
    const {
      recipient,
      deposit,
      tokenAddress,
      startTime,
      stopTime,
      interval,
      fixedRate,
    } = input;

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

const getSubscription = async (subscriptionId: BigInt): Promise<GetSubscriptionOutput> => {
  try {
    return await contract.getSubscription(subscriptionId);
  } catch (error) {
    console.error('Error in getSubscription:', error);
    throw new Error('Failed to get subscription details. Please try again later.');
  }
};

const depositFromSender = async (input: DepositFromSenderInput): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    return await contract.depositFromSender(subscriptionId, amount);
  } catch (error) {
    console.error('Error in depositFromSender:', error);
    throw new Error('Failed to deposit from sender. Please check the input and try again.');
  }
};

const withdrawFromRecipient = async (input: WithdrawFromRecipientInput): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    return await contract.withdrawFromRecipient(subscriptionId, amount);
  } catch (error) {
    console.error('Error in withdrawFromRecipient:', error);
    throw new Error('Failed to withdraw from recipient. Please check the input and try again.');
  }
};


export {
  createSubscription,
  getSubscription,
  depositFromSender,
  withdrawFromRecipient,
};
