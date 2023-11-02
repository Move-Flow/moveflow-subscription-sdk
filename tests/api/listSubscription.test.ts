import { createClient, cacheExchange, fetchExchange } from "urql";
import {
  listSenderSubscriptions,
  listRecipientSubscriptions,
  getSenderDepositLog,
  getWithdrawFromRecipientLog,
  getSenderInfo,
  getRecipientInfo,
  getSenderDepositLogAll,
  getRecipientWithdrawLog,
  getSenderSubscriptions,
} from "../../src/utils/api/queries";
import {
  GetDepositeFromSenderLogData,
  GetSubscriptionsByRecipientResponse,
  GetSubscriptionsSenderResponse,
  GetWithdrwaFromRecipientLogData,
  GetSenderInfoData,
  GetRecipientInfoData,
} from "../../src/utils/type";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/albinlau/moveflow-geroli";

const mockClient = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

let senderSubscriptionData: GetSubscriptionsSenderResponse;
let recipientSubscriptionData: GetSubscriptionsByRecipientResponse;

beforeAll(async () => {
  senderSubscriptionData = await listSenderSubscriptions(
    mockClient,
    "0x5866aa518cf0bbe994cc09bb3c3bae9290f77840",
    10,
    "startTime",
    0,
    "asc"
  );

  recipientSubscriptionData = await listRecipientSubscriptions(
    mockClient,
    "0xa8e7813150a988e7f20193983fa3017155f3c162",
    10,
    "startTime",
    0,
    "asc"
  );
});

describe("listSenderSubscriptions", () => {
  test("listSenderSubscriptions can work", async () => {
    expect(senderSubscriptionData).toBeDefined();
    const subscriptions = senderSubscriptionData.subscriptionLists;
    expect(subscriptions).toBeDefined();

    if (!subscriptions) {
      console.error("No sender subscription data found.");
      throw new Error("No sender subscription data found.");
    }

    for (const subscription of subscriptions) {
      const expectedProperties = {
        id: expect.any(String),
        fixedRate: expect.any(String),
        recipient: expect.any(Object),
        sender: expect.any(Object),
        interval: expect.any(String),
        lastWithdrawTime: expect.any(String),
        remainingBalance: expect.any(String),
        startTime: expect.any(String),
        stopTime: expect.any(String),
        tokenAddress: expect.any(String),
        withdrawableCount: expect.any(String),
        withdrawnBalance: expect.any(String),
        withdrawnCount: expect.any(String),
      };
      expect(subscription).toMatchObject(expectedProperties);
    }
  });
});

describe("listRecipientSubscriptions", () => {
  test("listRecipientSubscriptions can work", () => {
    expect(recipientSubscriptionData).toBeDefined();
    const subscriptions = recipientSubscriptionData.subscriptionLists;
    expect(subscriptions).toBeDefined();

    if (subscriptions) {
      for (const subscription of subscriptions) {
        const expectedProperties = {
          id: expect.any(String),
          fixedRate: expect.any(String),
          recipient: expect.any(Object),
          sender: expect.any(Object),
          interval: expect.any(String),
          lastWithdrawTime: expect.any(String),
          remainingBalance: expect.any(String),
          startTime: expect.any(String),
          stopTime: expect.any(String),
          tokenAddress: expect.any(String),
          withdrawableCount: expect.any(String),
          withdrawnBalance: expect.any(String),
          withdrawnCount: expect.any(String),
        };
        expect(subscription).toMatchObject(expectedProperties);
      }
    } else {
      console.error("No recipient subscription data found.");
      throw new Error("No recipient subscription data found.");
    }
  });
});

describe("getSenderDepositLog", () => {
  test("fetch sender deposit logs", async () => {
    try {
      const response: GetDepositeFromSenderLogData = await getSenderDepositLog(
        mockClient,
        "0x7a126"
      );

      expect(response).toBeDefined();
      expect(response.subscriptionList).toBeDefined();
      const senderDepositLogs = response.subscriptionList;
      console.log(senderDepositLogs);

      // Add more specific checks on the deposit logs if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getRecipientLogs", () => {
  test("fetch withdraw from recipient logs", async () => {
    try {
      const response: GetWithdrwaFromRecipientLogData =
        await getWithdrawFromRecipientLog(mockClient, "0x7a126");

      expect(response).toBeDefined();
      expect(response.subscriptionList).toBeDefined();
      const recipientLogs = response.subscriptionList;
      console.log("recipient logs:", recipientLogs);

      // Add more specific checks on the deposit logs if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getSenderInfo", () => {
  test("fetch sender info", async () => {
    try {
      const response: GetSenderInfoData = await getSenderInfo(
        mockClient,
        "0x5866aa518cf0bbe994cc09bb3c3bae9290f77840"
      );

      expect(response).toBeDefined();
      const senderInfo = response.sender;
      console.log("sender info:", senderInfo);

      // Add more specific checks on the sender info if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getRecipientInfo", () => {
  test("fetch recipient info", async () => {
    try {
      const response: GetRecipientInfoData = await getRecipientInfo(
        mockClient,
        "0xa8e7813150a988e7f20193983fa3017155f3c162"
      );

      expect(response).toBeDefined();
      const recipientInfo = response.recipient;
      console.log("recipient info:", recipientInfo);

      // Add more specific checks on the recipient info if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getSenderDepositLogAll", () => {
  test("fetch all sender deposit logs", async () => {
    try {
      const response = await getSenderDepositLogAll(
        mockClient,
        "0x5866aa518cf0bbe994cc09bb3c3bae9290f77840",
        10,
        0,
        "depositeTime",
        "asc"
      );

      expect(response).toBeDefined();
      expect(response.sender).toBeDefined();
      expect(response.sender.senderDepositeLog).toBeDefined();

      const depositLogs = response.sender.senderDepositeLog;
      console.log("deposit logs all", depositLogs);

      // Add more specific checks on the deposit logs if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getRecipientWithdrawLog", () => {
  test("fetch recipient withdrawal logs", async () => {
    try {
      const response = await getRecipientWithdrawLog(
        mockClient,
        "0xa8e7813150a988e7f20193983fa3017155f3c162",
        10,
        0,
        "withdrawTime",
        "asc"
      );

      expect(response).toBeDefined();
      expect(response.recipient).toBeDefined();
      expect(response.recipient.recipientWithdrawLog).toBeDefined();

      const withdrawalLogs = response.recipient.recipientWithdrawLog;
      console.log(withdrawalLogs);

      // Add more specific checks on the withdrawal logs if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

describe("getSenderSubscriptions", () => {
  test("fetch sender subscriptions with pagination", async () => {
    try {
      const response = await getSenderSubscriptions(
        mockClient,
        "0x5866aa518cf0bbe994cc09bb3c3bae9290f77840",
        "0xa8e7813150a988e7f20193983fa3017155f3c162",
        10,
        0,
        "startTime",
        "asc"
      );

      expect(response).toBeDefined();
      expect(response.sender).toBeDefined();
      expect(response.sender.subscriptions).toBeDefined();

      const senderSubscriptions = response.sender.subscriptions;
      console.log(senderSubscriptions);

      // Add more specific checks on the sender subscriptions if needed
    } catch (error) {
      console.error("Error in the test:", error);
      throw error; // Rethrow the error to fail the test
    }
  });
});

export { senderSubscriptionData, recipientSubscriptionData };
