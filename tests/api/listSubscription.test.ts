import { cacheExchange, createClient, fetchExchange } from "urql";
import { GetSubscriptionsResponse } from "../../src/utils/type";
import { listSubscriptions } from "../../src/sdk";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/albinlau/moveflow-geroli";

const mockClient = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

let subscriptionData: GetSubscriptionsResponse;

beforeAll(async () => {
  try {
    subscriptionData = await listSubscriptions(
      mockClient,
      //Fetching subscriptions from this wallet address
      "0x3f4ce45464915a5dfd1ed7e1175877d498dd2606"
    );
  } catch (error) {
    console.log(error);
  }
});

describe("listSubscriptions", () => {
  test("listSubscriptions can work", () => {
    // Assert that the response and data are defined
    expect(subscriptionData).toBeDefined();
    expect(subscriptionData.subscriptionLists).toBeDefined();

    if (subscriptionData.subscriptionLists) {
      // Loop through each subscription in the list
      for (const subscription of subscriptionData.subscriptionLists) {
        // Assert that all properties are defined
        expect(subscription.id).toBeDefined();
        expect(subscription.fixedRate).toBeDefined();
        expect(subscription.interval).toBeDefined();
        expect(subscription.lastWithdrawTime).toBeDefined();
        expect(subscription.remainingBalance).toBeDefined();
        expect(subscription.startTime).toBeDefined();
        expect(subscription.stopTime).toBeDefined();
        expect(subscription.tokenAddress).toBeDefined();
        expect(subscription.withdrawableCount).toBeDefined();
        expect(subscription.withdrawnBalance).toBeDefined();
        expect(subscription.withdrawnCount).toBeDefined();

        // Assert that fixedRate, interval, and withdrawableCount are non-negative numbers as strings
        expect(Number(subscription.fixedRate)).toBeGreaterThanOrEqual(0);
        expect(Number(subscription.interval)).toBeGreaterThanOrEqual(0);
        expect(Number(subscription.withdrawableCount)).toBeGreaterThanOrEqual(
          0
        );

        // Assert that lastWithdrawTime, remainingBalance, startTime, and stopTime are valid timestamps as strings
        expect(Number.isNaN(Number(subscription.lastWithdrawTime))).toBe(false);
        expect(Number.isNaN(Number(subscription.remainingBalance))).toBe(false);
        expect(Number.isNaN(Number(subscription.startTime))).toBe(false);
        expect(Number.isNaN(Number(subscription.stopTime))).toBe(false);

        // Assert that tokenAddress is a non-empty string
        expect(subscription.tokenAddress).toBeTruthy();

        // Assert that withdrawnBalance and withdrawnCount are non-negative integers as strings
        expect(Number.isInteger(Number(subscription.withdrawnBalance))).toBe(
          true
        );
        expect(Number.isInteger(Number(subscription.withdrawnCount))).toBe(
          true
        );
        expect(Number(subscription.withdrawnBalance)).toBeGreaterThanOrEqual(0);
        expect(Number(subscription.withdrawnCount)).toBeGreaterThanOrEqual(0);
      }
    } else {
      // No subscriptions found, fail the test
      console.error("No subscription data found.");
      throw new Error("No subscription data found.");
    }
  });
});

export { subscriptionData };
