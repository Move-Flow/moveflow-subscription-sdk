import { ethers } from "ethers";
require("dotenv").config();
import SubscriptionABI from "./lib/contractABIs/subsrciptionABI.json";
import ApproveABI from "./lib/contractABIs/approveABI.json";
import coinAddressStore from "./utils/coinAddress";
import {
  CreateSubscriptionInput,
  DepositFromSenderInput,
  WithdrawFromRecipientInput,
  Chain,
} from "./utils/type";

import { initializeProvider } from "./utils/chain";

// Ethereum provider URL and contract information

const contractAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
const privateKey ="Your private Key";
const chain = Chain.Goerli; // Set the chain here (e.g., Sepolia, Goerli)
const provider = initializeProvider(chain); // Initialize the provider
const wallet = new ethers.Wallet(privateKey, provider);

const tokenContractAddress = coinAddressStore.coinAddress;

const amountToApprove = "2";
const smartContractAddress = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
const contract = new ethers.Contract(
  smartContractAddress,
  SubscriptionABI,
  wallet
);

// Define the types for the parameters
type TokenContractAddress = string;
type AmountToApprove = string;
type SmartContractAddress = string;

export async function approveTokensForContract(
  wallet: ethers.Wallet,
  tokenContractAddress: TokenContractAddress,
  smartContractAddress: SmartContractAddress,
  amountToApprove: AmountToApprove
): Promise<void> {
  try {
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      ApproveABI,
      wallet
    );

    // Approve the smart contract to spend tokens on your behalf
    const approvalTx = await tokenContract.approve(
      smartContractAddress,
      amountToApprove
    );

    // Wait for the approval transaction to be mined
    await approvalTx.wait();
    console.log("Approval successful!");
  } catch (error) {
    console.error("Error in approving tokens:", error);
    throw new Error("Failed to approve tokens for the smart contract.");
  }
}

// Call the async function to approve tokens
approveTokensForContract(
  wallet,
  tokenContractAddress,
  smartContractAddress,
  amountToApprove
).catch((err) => {
  console.log(err);
  // Handle errors
});

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

const validateRecipient = (recipient: string) => {
  if (!recipient) {
    throw new Error(
      "Recipient is undefined. Please provide a valid recipient address."
    );
  }
  if (recipient === wallet.address) {
    console.log("my address:", wallet.address);
    throw new Error("Subscription to the caller is not allowed.");
  }
  if (recipient === contractAddress) {
    throw new Error("Subscription to the contract itself is not allowed.");
  }
};

const validateDeposit = (deposit: BigInt) => {
  if (deposit.toString() <= BigInt(0).toString()) {
    throw new Error("Deposit amount must be greater than zero.");
  }
};

const validateStartStopTimes = (startTime: BigInt, stopTime: BigInt) => {
  if (startTime.toString() < BigInt(Math.floor(Date.now() / 1000)).toString()) {
    throw new Error("Start time is before the current block timestamp.");
  }
  if (stopTime <= startTime) {
    throw new Error("Stop time is before or equal to the start time.");
  }
};

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

  validateRecipient(recipient);
  validateDeposit(deposit);
  validateStartStopTimes(startTime, stopTime);

  // Create the subscription
  try {
    await contract.createSubscription(
      recipient,
      deposit,
      tokenAddress,
      startTime,
      stopTime,
      interval,
      fixedRate,
      { gasLimit: 200000 }
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
      amount,
      { gasLimit: 200000 }
    );
    console.log("deposit successful");
    return depositResult;
  } catch (error) {
    console.error("Error in depositFromSender:", error);
    throw new Error(
      "Failed to deposit from sender. Please check the input and try again."
    );
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
    await contract.withdrawFromRecipient(subscriptionId, amount, {
      gasLimit: 200000,
    });

    // Return true if the withdrawal was initiated successfully
    console.log("withdraw successful");
    return true;
  } catch (error) {
    console.error("Error in withdrawFromRecipient:", error);
    throw new Error(
      "Failed to withdraw from recipient. Please check the input and try again."
    );
  }
};

export { createSubscription, depositeFromSender, withdrawFromRecipient };
