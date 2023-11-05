import { createClient, cacheExchange, fetchExchange } from "urql";

// Define a map of chain types to GraphQL API URLs
const chainTypeToApiUrl = {
  georli: "https://api.thegraph.com/subgraphs/name/albinlau/moveflow-geroli",
  // Add more chain types and corresponding URLs as needed
};

// Define a type for chain types
export type ChainType = keyof typeof chainTypeToApiUrl; // Export the ChainType type

// Create a function to get the API URL based on the chain type
const getApiUrl = (chainType: ChainType) => {
  return chainTypeToApiUrl[chainType] || null;
};

const createGraphQLClient = (chainType: ChainType) => {
  const apiUrl = getApiUrl(chainType);

  if (!apiUrl) {
    throw new Error(`Invalid chain type: ${chainType}`);
  }

  const client = createClient({
    url: apiUrl,
    exchanges: [cacheExchange, fetchExchange],
  });

  return client;
};

export default createGraphQLClient;
