import { ethers, } from 'ethers';
import SubscriptionABI from "./lib/contractABIs/subsrciptionABI.json";
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
} from './utils/type';

const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
        const provider = new ethers.JsonRpcProvider(infuraUrl);
        const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
        // dump wallet private key that contains sepolia 
        const privateKey = '753e10bc305827ad956b98c178ed80b0c98900d40a6ecec3e05fe373ad9f85a3';
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

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
