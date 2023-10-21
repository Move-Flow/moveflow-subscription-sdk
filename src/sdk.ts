import { ethers } from "ethers";
require("dotenv").config();
import SubscriptionABI from "./lib/contractABIs/subsrciptionABI.json";
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
  GetSubscriptionsResponse,
} from "./utils/type";
import { Client } from "urql";
import { GET_SUBSCRIPTIONS } from "./utils/api/queries";

// Ethereum provider URL and contract information
const sepoliaKey = process.env.SEPOLIA_KEY;
const infuraUrl = `https://sepolia.infura.io/v3/${sepoliaKey}`;
const contractAddress = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
const privateKey =
  "753e10bc305827ad956b98c178ed80b0c98900d40a6ecec3e05fe373ad9f85a3";

// Create an Ethereum provider and wallet
const provider = new ethers.JsonRpcProvider(infuraUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

// Create a subscription with validation checks
const createSubscription = async (
  input: CreateSubscriptionInput
): Promise<void> => {
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
    throw new Error(
      "Recipient is undefined. Please provide a valid recipient address."
    );
  }

  if (stopTime < startTime) {
    throw new Error("Stop time cannot be earlier than start time.");
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (BigInt(stopTime.toString()) < BigInt(currentTimestamp)) {
    throw new Error("Stop time cannot be in the past.");
  }

  if (BigInt(deposit.toString()) <= BigInt(0)) {
    throw new Error("Deposit amount must be greater than zero.");
  }

  const userBalance = await wallet.provider?.getBalance(wallet.address);
  const depositAmount = ethers.parseEther(deposit.toString());

  if (
    userBalance &&
    depositAmount &&
    fixedRate &&
    BigInt(userBalance.toString()) <
      BigInt(depositAmount.toString()) + BigInt(fixedRate.toString())
  ) {
    throw new Error("User balance is insufficient to create the subscription.");
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

    console.log("Transaction successful: createSubscription");
  } catch (error) {
    console.error("Error in createSubscription:", error);
    throw new Error(
      "Failed to create subscription. Please check the input and try again."
    );
  }
};

// Deposit funds from the sender
const depositeFromSender = async (
  input: DepositFromSenderInput
): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    console.log(subscriptionId, "deposit");

    // Check if subscriptionId is a positive integer
    if (!subscriptionId || subscriptionId.toString() <= BigInt(0).toString()) {
      throw new Error(
        "Invalid subscription ID. Please provide a valid positive integer."
      );
    }

    // Check if the deposit amount is a positive number
    if (!amount || amount.toString() <= BigInt(0).toString()) {
      throw new Error(
        "Invalid deposit amount. Please provide a valid positive number."
      );
    }

    // Fetch user balance
    const userBalance = await wallet.provider?.getBalance(wallet.address);
    if (
      userBalance &&
      amount &&
      BigInt(userBalance.toString()) < BigInt(amount.toString())
    ) {
      throw new Error(
        "User balance is insufficient to create the subscription."
      );
    }

    const depositResult = await contract.depositeFromSender(
      subscriptionId,
      amount
    );

    return depositResult;
  } catch (error) {
    console.error("Error in depositFromSender:", error);
    throw new Error(
      "Failed to deposit from sender. Please check the input and try again."
    );
  }
};

// Retrieve subscription details
const getSubscription = async (
  subscriptionId: BigInt
): Promise<GetSubscriptionOutput> => {
  try {
    // Check if subscriptionId is a positive integer
    if (!subscriptionId || subscriptionId.toString() <= BigInt(0).toString()) {
      throw new Error(
        "Invalid subscription ID. Please provide a valid positive integer."
      );
    }

    const subscriptionDetails = await contract.getSubscription(subscriptionId);
    console.log(subscriptionDetails);

    // Check if the retrieved subscription details are valid
    if (!subscriptionDetails || !subscriptionDetails.id) {
      throw new Error("Failed to retrieve valid subscription details.");
    }

    return subscriptionDetails;
  } catch (error) {
    console.error("Error in getSubscription:", error);
    throw new Error(
      "Failed to get subscription details. Please try again later."
    );
  }
};

// List created subscriptions

const listSubscriptions = async (
  client: Client
): Promise<GetSubscriptionsResponse> => {
  try {
    const response = await client.query(GET_SUBSCRIPTIONS, {}).toPromise();
    if (response.error) {
      console.error("Error fetching subscriptions:", response.error);
      throw new Error("Failed to fetch subscriptions.");
    }
    const subscriptionData = response.data as GetSubscriptionsResponse;

    if (
      subscriptionData &&
      Array.isArray(subscriptionData.subscriptionLists) &&
      subscriptionData.subscriptionLists.length > 0
    ) {
      console.log("Data fetched successfully.", subscriptionData);
      return subscriptionData;
    } else {
      console.error("No subscription data found.");
      throw new Error("No subscription data found.");
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw new Error("Failed to fetch subscriptions.");
  }
};

// Withdraw funds from the recipient
const withdrawFromRecipient = async (
  input: WithdrawFromRecipientInput
): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
    console.log(subscriptionId, "withdraw");

    // Check if subscriptionId is a positive integer
    if (!subscriptionId || subscriptionId.toString() <= BigInt(0).toString()) {
      throw new Error(
        "Invalid subscription ID. Please provide a valid positive integer."
      );
    }

    // Check if the withdrawal amount is a positive number
    if (!amount || amount.toString() <= BigInt(0).toString()) {
      throw new Error(
        "Invalid withdrawal amount. Please provide a valid positive number."
      );
    }

    // // Fetch subscription details to perform additional checks if needed
    // const subscriptionDetails = await getSubscription(subscriptionId);
    // Add additional checks based on subscription details if necessary

    // Perform the withdrawal logic if all checks pass
    await contract.withdrawFromRecipient(subscriptionId, amount);

    // Return true if the withdrawal was initiated successfully
    return true;
  } catch (error) {
    console.error("Error in withdrawFromRecipient:", error);
    throw new Error(
      "Failed to withdraw from recipient. Please check the input and try again."
    );
  }
};

export {
  createSubscription,
  getSubscription,
  depositeFromSender,
  withdrawFromRecipient,
  listSubscriptions,
};
