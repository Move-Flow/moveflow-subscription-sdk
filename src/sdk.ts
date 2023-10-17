import { ethers, Wallet} from 'ethers';

import subscriptionAbi from "./lib/contractABIs/subsrciptionABI.json"
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  Chain,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
  
} from './utils/type';




// Create a SubscriptionContract instance
const contract = new ethers.Contract('your_contract_address',  subscriptionAbi)

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

  await contract.createSubscription(
    recipient,
    deposit,
    tokenAddress,
    startTime,
    stopTime,
    interval,
    fixedRate
  );
};

const getSubscription = async (subscriptionId: BigInt): Promise<GetSubscriptionOutput> => {
    return await contract.getSubscription(subscriptionId);
  };

const depositFromSender = async (input: DepositFromSenderInput): Promise<boolean> => {
  const { subscriptionId, amount } = input;
  return await contract.depositFromSender(subscriptionId, amount);
};

const withdrawFromRecipient = async (input: WithdrawFromRecipientInput): Promise<boolean> => {
  const { subscriptionId, amount } = input;
  return await contract.withdrawFromRecipient(subscriptionId, amount);
};

export {
  createSubscription,
  getSubscription,
  depositFromSender,
  withdrawFromRecipient,
};
