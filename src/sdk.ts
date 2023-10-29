import { ethers } from "ethers";
require("dotenv").config();
import SubscriptionABI from "./lib/contractABIs/subsrciptionABI.json";
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  GetSubscriptionOutput,
  GetSubscriptionsResponse,
  Chain,
} from "./utils/type";
import { Client } from "urql";
import { GET_SUBSCRIPTIONS } from "./utils/api/queries";
import { initializeProvider } from "./utils/chain";

// Ethereum provider URL and contract information

const contractAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
const privateKey = "Your private key";
const chain = Chain.Sepolia; // Set the chain here (e.g., Sepolia, Goerli)
const provider = initializeProvider(chain); // Initialize the provider
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

// Create a subscription with validation checks
/**
 * Create a subscription with validation checks.
 *
 * @param {CreateSubscriptionInput} input - The input data for creating the subscription.
 * @param {string} input.recipient - The recipient's address for the subscription.
 * @param {number} input.deposit - The deposit amount for the subscription.
 * @param {string} input.tokenAddress - The address of the token for the subscription.
 * @param {number} input.startTime - The start time of the subscription.
 * @param {number} input.stopTime - The stop time of the subscription.
 * @param {number} input.interval - The interval for the subscription.
 * @param {string} input.fixedRate - The fixed rate for the subscription.
 * @throws {Error} Throws an error if validation checks fail or the subscription creation fails.
 */

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

/**
 * Deposit funds from the sender to a subscription.
 *
 * @param {DepositFromSenderInput} input - The input data for depositing funds.
 * @param {number} input.subscriptionId - The ID of the subscription to deposit to.
 * @param {number} input.amount - The amount to deposit to the subscription.
 * @throws {Error} Throws an error if validation checks fail or the deposit operation fails.
 * @returns {Promise<boolean>} Returns `true` if the deposit was successful.
 */
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

// // Retrieve subscription details
// const getSubscription = async (
//   subscriptionId: BigInt
// ): Promise<GetSubscriptionOutput> => {
//   try {
//     // Check if subscriptionId is a positive integer
//     if (!subscriptionId || subscriptionId.toString() <= BigInt(0).toString()) {
//       throw new Error(
//         "Invalid subscription ID. Please provide a valid positive integer."
//       );
//     }

//     const subscriptionDetails = await contract.getSubscription(subscriptionId);
//     console.log(subscriptionDetails);

//     // Check if the retrieved subscription details are valid
//     if (!subscriptionDetails || !subscriptionDetails.id) {
//       throw new Error("Failed to retrieve valid subscription details.");
//     }

//     return subscriptionDetails;
//   } catch (error) {
//     console.error("Error in getSubscription:", error);
//     throw new Error(
//       "Failed to get subscription details. Please try again later."
//     );
//   }
// };

/**
 * List subscriptions created by a specific sender.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} sender - The sender's address for which to list subscriptions.
 * @returns {Promise<GetSubscriptionsResponse>} Returns subscription data if successful.
 * @throws {Error} Throws an error if the query fails or no subscriptions are found.
 */
const listSubscriptions = async (
  client: Client,
  sender: string
): Promise<GetSubscriptionsResponse> => {
  try {
    const senderLowerCase = sender.toLowerCase();
    const response = await client
      .query(GET_SUBSCRIPTIONS, { sender: senderLowerCase })
      .toPromise();
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
      console.log("subscription data fetched successfully", subscriptionData);
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

/**
  // Withdraw funds from the recipient
 * @notice Initiates a withdrawal of funds from the recipient's side of the subscription.
 * @dev Ensures the subscription ID and withdrawal amount are valid and positive.
 * @param subscriptionId The id of the subscription to withdraw tokens from.
 * @param amount The amount of tokens to withdraw.
 * @returns A boolean indicating whether the withdrawal was successfully initiated.
 * @throws An error if the subscription ID or withdrawal amount is invalid, or if the withdrawal fails.
 */
const withdrawFromRecipient = async (
  input: WithdrawFromRecipientInput
): Promise<boolean> => {
  try {
    const { subscriptionId, amount } = input;
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
