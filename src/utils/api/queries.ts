
import {
  GetDepositeFromSenderLogData,
  GetRecipientInfoData,
  GetRecipientWithdrawLogData,
  GetSenderDepositeLogAllData,
  GetSenderInfoData,
  GetSenderSubscriptionsData,
  GetSubscriptionsByRecipientResponse,
  GetSubscriptionsSenderResponse,
  GetWithdrwaFromRecipientLogData,
} from "../type";
import {
  GET_RECIPIENT_INFO,
  GET_RECIPIENT_WITHDRAW_LOG,
  GET_Recipient_SUBSCRIPTIONS,
  GET_SENDER_DEPOSIT_LOG,
  GET_SENDER_DEPOSIT_LOG_ALL,
  GET_SENDER_INFO,
  GET_SENDER_SUBSCRIPTIONS,
  GET_SENDER_SUBSCRIPTIONS_WITH_RECIPIENT_FILTER,
  GET_WITHDRAW_From_RECIPIENT_LOG,
} from "./schemas";
import createGraphQLClient, { ChainType } from "./client-config";

/**
 * List subscriptions created by a specific sender.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} sender - The sender's address for which to list subscriptions.
 * @param {number} first - The number of subscriptions to retrieve.
 * @param {string} orderBy - The field to order the results by.
 * @param {number} skip - The number of subscriptions to skip before retrieving.
 * @param {string} orderDirection - The direction to order the results (asc or desc).
 * @returns {Promise<GetSubscriptionsSenderResponse>} Returns subscription data if successful.
 * @throws {Error} Throws an error if the query fails or no subscriptions are found.
 */
const listSenderSubscriptions = async (
  chainType: ChainType,
  sender: string,
  first: number,
  orderBy: string,
  skip: number,
  orderDirection: string
): Promise<GetSubscriptionsSenderResponse> => {
  try {
    const senderLowerCase = sender.toLowerCase();
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_SENDER_SUBSCRIPTIONS, {
        sender: senderLowerCase,
        first: first,
        orderBy: orderBy,
        skip: skip,
        orderDirection: orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching subscriptions:", response.error);
      throw new Error("Failed to fetch subscriptions.");
    }
    const subscriptionData = response.data as GetSubscriptionsSenderResponse;

    if (
      subscriptionData &&
      Array.isArray(subscriptionData.subscriptionLists) &&
      subscriptionData.subscriptionLists.length > 0
    ) {
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
 * List subscriptions received by a specific recipient.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} recipient - The recipient's address for which to list subscriptions.
 * @param {number} first - The number of subscriptions to retrieve.
 * @param {string} orderBy - The field to order the results by.
 * @param {number} skip - The number of subscriptions to skip before retrieving.
 * @param {string} orderDirection - The direction to order the results (asc or desc).
 * @returns {Promise<GetSubscriptionsByRecipientResponse>} Returns subscription data if successful.
 * @throws {Error} Throws an error if the query fails or no subscriptions are found.
 */
const listRecipientSubscriptions = async (
  chainType: ChainType,
  recipient: string,
  first: number,
  orderBy: string,
  skip: number,
  orderDirection: string
): Promise<GetSubscriptionsByRecipientResponse> => {
  try {
    const recipientIdLowerCase = recipient.toLowerCase();
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_Recipient_SUBSCRIPTIONS, {
        recipient: recipientIdLowerCase,
        first: first,
        orderBy: orderBy,
        skip: skip,
        orderDirection: orderDirection,
      })
      .toPromise();

    // Return the response
    return response.data as GetSubscriptionsByRecipientResponse;
  } catch (error) {
    // Handle errors or rethrow the error
    console.error("Error fetching recipient subscriptions:", error);
    throw new Error("Failed to fetch recipient subscriptions.");
  }
};

/**
 * Get withdrawal data from a specific recipient's subscription log.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} subscriptionId - The ID of the subscription for which to fetch withdrawal data.
 * @returns {Promise<GetWithdrwaFromRecipientLogData>} Returns withdrawal data if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getWithdrawFromRecipientLog = async (
  chainType: ChainType,
  subscriptionId: string,
  first: number,
  skip: number,
  orderBy: string,
  orderDirection: string
): Promise<GetWithdrwaFromRecipientLogData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_WITHDRAW_From_RECIPIENT_LOG, {
        id: subscriptionId,
        first,
        skip,
        orderBy,
        orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching withdrawal logs:", response.error);
      throw new Error("Failed to fetch withdrawal logs.");
    }

    const data = response.data as GetWithdrwaFromRecipientLogData;
    console.log("getWithdrawFromRecipientLog", data);

    if (data && data.subscriptionList) {
      return data;
    } else {
      console.error("No withdrawal log data found.");
      throw new Error("No withdrawal log data found.");
    }
  } catch (error) {
    console.error("Error fetching withdrawal logs:", error);
    throw new Error("Failed to fetch withdrawal logs.");
  }
};

/**
 * Get sender deposit data from a specific subscription log with pagination.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} subscriptionId - The ID of the subscription for which to fetch sender deposit data.
 * @param {number} first - The number of records to fetch.
 * @param {number} skip - The number of records to skip.
 * @param {string} orderBy - The field to order results by.
 * @param {string} orderDirection - The order direction (asc or desc).
 * @returns {Promise<GetDepositeFromSenderLogData>} Returns sender deposit data if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */

const getSenderDepositLog = async (
  chainType: ChainType,
  subscriptionId: string,
  first: number,
  skip: number,

  orderBy: string,
  orderDirection: string
): Promise<GetDepositeFromSenderLogData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_SENDER_DEPOSIT_LOG, {
        id: subscriptionId,
        first,
        skip,
        orderBy,
        orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching sender deposit logs:", response.error);
      throw new Error("Failed to fetch sender deposit logs.");
    }

    const data = response.data as GetDepositeFromSenderLogData;
    console.log("GetDepositeFromSenderLogs", data);

    if (data && data.subscriptionList) {
      return data;
    } else {
      console.error("No sender deposit log data found.");
      throw new Error("No sender deposit log data found.");
    }
  } catch (error) {
    console.error("Error fetching sender deposit logs:", error);
    throw new Error("Failed to fetch sender deposit logs.");
  }
};

/**
 * Get information about a specific sender.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} senderId - The Address of the sender for which to fetch information.
 * @returns {Promise<GetSenderInfoData>} Returns sender information if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getSenderInfo = async (
  chainType: ChainType,
  senderId: string
): Promise<GetSenderInfoData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_SENDER_INFO, { id: senderId })
      .toPromise();

    if (response.error) {
      console.error("Error fetching sender information:", response.error);
      throw new Error("Failed to fetch sender information.");
    }

    const data = response.data as GetSenderInfoData;
    console.log(data);

    if (data && data.sender) {
      return data;
    } else {
      console.error("No sender information found.");
      throw new Error("No sender information found.");
    }
  } catch (error) {
    console.error("Error fetching sender information:", error);
    throw new Error("Failed to fetch sender information.");
  }
};

/**
 * Get information about a specific recipient.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} recipientId - The Address of the recipient for which to fetch information.
 * @returns {Promise<GetRecipientInfoData>} Returns recipient information if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getRecipientInfo = async (
  chainType: ChainType,
  recipientId: string
): Promise<GetRecipientInfoData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_RECIPIENT_INFO, {
        id: recipientId,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching recipient info:", response.error);
      throw new Error("Failed to fetch recipient info.");
    }

    const data = response.data as GetRecipientInfoData;

    if (data && data.recipient) {
      return data;
    } else {
      console.error("No recipient info data found.");
      throw new Error("No recipient info data found.");
    }
  } catch (error) {
    console.error("Error fetching recipient info:", error);
    throw new Error("Failed to fetch recipient info.");
  }
};

/**
 * Get all sender deposit logs for a specific sender.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} senderId - The ID of the sender for which to fetch deposit logs.
 * @param {number} first - The number of deposit logs to retrieve.
 * @param {number} skip - The number of deposit logs to skip before retrieving.
 * @param {string} orderBy - The field to order the results by.
 * @param {string} orderDirection - The direction to order the results (asc or desc).
 * @returns {Promise<GetSenderDepositeLogAllData>} Returns sender deposit log data if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getSenderDepositLogAll = async (
  chainType: ChainType,
  senderId: string,
  first: number,
  skip: number,
  orderBy: string,
  orderDirection: string
): Promise<GetSenderDepositeLogAllData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_SENDER_DEPOSIT_LOG_ALL, {
        id: senderId,
        first,
        skip,
        orderBy,
        orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching sender deposit logs:", response.error);
      throw new Error("Failed to fetch sender deposit logs.");
    }

    const data = response.data as GetSenderDepositeLogAllData;
    console.log("Sender deposit logs (all):", data);

    if (data && data.sender && data.sender.senderDepositeLog) {
      return data;
    } else {
      console.error("No sender deposit log data found.");
      throw new Error("No sender deposit log data found.");
    }
  } catch (error) {
    console.error("Error fetching sender deposit logs:", error);
    throw new Error("Failed to fetch sender deposit logs.");
  }
};

/**
 * Get recipient withdrawal logs.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} recipientId - The Address of the recipient for which to fetch withdrawal logs.
 * @param {number} first - The number of logs to retrieve.
 * @param {number} skip - The number of logs to skip before retrieving.
 * @param {string} orderBy - The field to order the results by.
 * @param {string} orderDirection - The direction to order the results (asc or desc).
 * @returns {Promise<GetRecipientWithdrawLogData>} Returns recipient withdrawal log data if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getRecipientWithdrawLog = async (
  chainType: ChainType,
  recipientId: string,
  first: number,
  skip: number,
  orderBy: string,
  orderDirection: string
): Promise<GetRecipientWithdrawLogData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_RECIPIENT_WITHDRAW_LOG, {
        id: recipientId,
        first,
        skip,
        orderBy,
        orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error(
        "Error fetching recipient withdrawal logs:",
        response.error
      );
      throw new Error("Failed to fetch recipient withdrawal logs.");
    }

    const data = response.data as GetRecipientWithdrawLogData;
    console.log("Recipient withdrawal logs", data);

    if (data && data.recipient && data.recipient.recipientWithdrawLog) {
      return data;
    } else {
      console.error("No recipient withdrawal log data found.");
      throw new Error("No recipient withdrawal log data found.");
    }
  } catch (error) {
    console.error("Error fetching recipient withdrawal logs:", error);
    throw new Error("Failed to fetch recipient withdrawal logs.");
  }
};

/**
 * Get sender subscriptions with a recipient filter.
 *
 * @param {Client} client - The GraphQL client used for making queries.
 * @param {string} senderId - The Address of the sender for which to fetch subscriptions.
 * @param {string} recipientId - The Address of the recipient for filtering subscriptions.
 * @param {number} first - The number of subscriptions to retrieve.
 * @param {number} skip - The number of subscriptions to skip before retrieving.
 * @param {string} orderBy - The field to order the results by.
 * @param {string} orderDirection - The direction to order the results (asc or desc).
 * @returns {Promise<GetSenderSubscriptionsData>} Returns sender subscriptions data if successful.
 * @throws {Error} Throws an error if the query fails, no data is found, or if there's an error response.
 */
const getSenderSubscriptions = async (
  chainType: ChainType,
  senderId: string,
  recipientId: string,
  first: number,
  skip: number,
  orderBy: string,
  orderDirection: string
): Promise<GetSenderSubscriptionsData> => {
  try {
    const client = createGraphQLClient(chainType);
    const response = await client
      .query(GET_SENDER_SUBSCRIPTIONS_WITH_RECIPIENT_FILTER, {
        senderId,
        recipientId,
        first,
        skip,
        orderBy,
        orderDirection,
      })
      .toPromise();

    if (response.error) {
      console.error("Error fetching sender subscriptions:", response.error);
      throw new Error("Failed to fetch sender subscriptions.");
    }

    const data = response.data as GetSenderSubscriptionsData;

    if (data && data.sender && data.sender.subscriptions) {
      console.log(
        "Subscriptions between sender and recipient:",
        data.sender.subscriptions
      );
      return data;
    } else {
      console.error("No sender subscription data found.");
      throw new Error("No sender subscription data found.");
    }
  } catch (error) {
    console.error("Error fetching sender subscriptions:", error);
    throw new Error("Failed to fetch sender subscriptions.");
  }
};

export {
  listSenderSubscriptions,
  listRecipientSubscriptions,
  getWithdrawFromRecipientLog,
  getSenderDepositLog,
  getRecipientInfo,
  getSenderInfo,
  getSenderDepositLogAll,
  getRecipientWithdrawLog,
  getSenderSubscriptions,
};
