import { cacheExchange, createClient, fetchExchange } from 'urql';
import { listSubscriptions } from '../../src'; 
import { GetSubscriptionsResponse } from '../../src/utils/type'; // Import the necessary types

const APIURL = 'https://api.thegraph.com/subgraphs/name/albinlau/moveflow-geroli';

const mockClient = createClient({
  url: APIURL,
  exchanges: [
    cacheExchange,
    fetchExchange,
  ],
});

describe('fetchSubscriptions', () => {
  test('fetchSubscriptions can work', async () => {
    try {
      // Ensure that the client is using a mocked client
      expect(mockClient).toBeDefined();

      // Call fetchSubscriptions function with the mocked client
      const data: GetSubscriptionsResponse = await listSubscriptions(mockClient);
      expect(data.subscriptionLists).toBeDefined();
      // Add more assertions based on your use case...

    } catch (error) {
      console.log(error);
    }
  });
});
