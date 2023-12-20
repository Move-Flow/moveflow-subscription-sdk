import { ethers } from "ethers";
require("dotenv").config();
import ApproveABI from "./lib/contractABIs/approveABI.json";
import SubscriptionABI from "./lib/contractABIs/subsrciptionABI.json";
import coinAddressStore from "./utils/contractAddress";
import { Chain } from "./utils/type";

import { initializeProvider } from "./utils/chain";
// import { listSenderSubscriptions } from "./utils/api/queries";
import client from "./utils/api/client-config";
import { GET_SUBSCRIPTION_BY_ID } from "./utils/api/schemas";

// Ethereum provider URL and contract information

const contractAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
const privateKey =
  "Your private key";
const chain = Chain.Goerli; // Set the chain here (e.g., Sepolia, Goerli)
const provider = initializeProvider(chain); // Initialize the provider
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

console.log("provider log:", provider.getNetwork());

// Define the types for the parameters
const tokenContractAddress = coinAddressStore.coinAddress;
console.log(tokenContractAddress);
const amountToApprove = "7";
const smartContractAddress = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
// Define the types for the parameters
type TokenContractAddress = string;
type AmountToApprove = string;
type SmartContractAddress = string;
type CreateSubscriptionInput = {
  recipient: string;
  deposit: string;
  tokenAddress: TokenContractAddress;
  startTime: number;
  stopTime: number;
  interval: number;
  fixedRate: string;
};

async function approveTokensForContract(
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

    // Set an appropriate gas price (in wei) for the transaction

    // Approve the smart contract to spend tokens on your behalf with the specified gas price
    const approvalTx = await tokenContract.approve(
      smartContractAddress,
      amountToApprove,
      { gasLimit: 200000 }
    );

    // Wait for the approval transaction to be mined
    await approvalTx.wait();
    console.log("approved");

    // Now, create a subscription
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

      // Create the subscription
      try {
        const tx = await contract.createSubscription(
          recipient,
          deposit,
          tokenAddress,
          startTime,
          stopTime,
          interval,
          fixedRate,
          { gasLimit: 200000 }
        );

        const receipt = await tx.wait();
        console.log(receipt);
        console.log("Transaction successful: createSubscription");
      } catch (error) {
        console.error("Error in createSubscription:", error);
        throw new Error(
          "Failed to create subscription. Please check the input and try again."
        );
      }
    };

    // Call the createSubscription function
    const createSubscriptionInput: CreateSubscriptionInput = {
      recipient: "0x5866aa518cf0bbe994cc09bb3c3bae9290f77840",
      deposit: "1", // Amount of deposit
      tokenAddress: tokenContractAddress,
      startTime: 1645218800, // Unix timestamp for the start time
      stopTime: 1648800800, // Unix timestamp for the stop time
      interval: 86400, // Interval in seconds (e.g., 1 day)
      fixedRate: "2", // Fixed rate as a string
    };

    await createSubscription(createSubscriptionInput);
  } catch (error) {
    console.error("Error in approving tokens:", error);
    throw new Error("Failed to approve tokens for the smart contract.");
  }
}

/**
 * Cancel a subscription if the current timestamp is less than the stop time.
 * @param subscriptionId The ID of the subscription to cancel.
 */
const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await client
      .query(GET_SUBSCRIPTION_BY_ID, {
        subscriptionId,
      })
      .toPromise();
    const subscription = response.data.subscriptionList;
    console.log(subscription);

    if (subscription) {
      // Check if the subscription is found
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const stopTime = BigInt(subscription.stopTime.toString()); // Stop time in seconds

      if (currentTime < stopTime) {
        // Subscription can be canceled
        const result = await contract.cancelSubscription(subscriptionId, {
          gasLimit: 200000, // Adjust the gas limit as needed
        });

        if (result) {
          console.log(
            `Subscription with ID ${subscriptionId} has been canceled.`
          );
        } else {
          console.error(
            `Failed to cancel subscription with ID ${subscriptionId}.`
          );
        }
      } else {
        console.error("Subscription cannot be canceled after the stop time.");
        throw new Error("Subscription cannot be canceled after the stop time.");
      }
    } else {
      console.error(`Subscription with ID ${subscriptionId} not found.`);
      throw new Error(`Subscription with ID ${subscriptionId} not found.`);
    }
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    throw new Error(
      "Failed to cancel the subscription. Please check the input and try again."
    );
  }
};

const specificSubscriptionId = "0x7a122";

cancelSubscription(specificSubscriptionId);

// // Assuming 'query.ts' is in the same directory

// const withdrawFromRecipient = async (input: {
//   subscriptionId: string;
//   amount: BigInt;
// }) => {
//   try {
//     const { subscriptionId, amount } = input;

//     // Check if subscriptionId is a positive integer
//     if (!subscriptionId || BigInt(subscriptionId) <= BigInt(0)) {
//       throw new Error(
//         "Invalid subscription ID. Please provide a valid positive integer."
//       );
//     }

//     // Check if the withdrawal amount is a positive number
//     if (
//       !amount ||
//       BigInt(amount.toString()).toString() <= BigInt(0).toString()
//     ) {
//       throw new Error(
//         "Invalid withdrawal amount. Please provide a valid positive number."
//       );
//     }

// const response = await client
//   .query(GET_SUBSCRIPTION_BY_ID, {
//     subscriptionId,
//   })
//   .toPromise();
// const subscription = response.data.subscriptionList;
// if (!subscription || !subscription.id) {
//   throw new Error(`Subscription with ID ${subscriptionId} not found.`);
// }

//     const remainingBalance = BigInt(subscription.remainingBalance);
//     console.log(remainingBalance);

//     // Compare remainingBalance with the withdrawal amount
//     if (remainingBalance.toString() >= amount.toString()) {
//       // Perform the withdrawal logic if the balance allows
//       await contract.withdrawFromRecipient(subscriptionId, amount, {
//         gasLimit: 300000,
//       });

//       console.log("Withdrawal successful");
//       return true;
//     } else {
//       throw new Error("Withdrawal amount exceeds the available balance.");
//     }
//   } catch (error) {
//     console.error("Error in withdrawFromRecipient:", error);
//     throw new Error(
//       "Failed to withdraw from the recipient. Please check the input and try again."
//     );
//   }
// };

// // Example usage:
// const input = {
//   subscriptionId: "0x7a124", // as a string
//   amount: BigInt("001"), // Convert the amount to BigInt
// };

// withdrawFromRecipient(input);

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
