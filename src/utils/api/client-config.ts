import { createClient, cacheExchange, fetchExchange } from 'urql';

const APIURL = 'https://api.thegraph.com/subgraphs/name/albinlau/moveflow-geroli';

const client = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

export default client;
