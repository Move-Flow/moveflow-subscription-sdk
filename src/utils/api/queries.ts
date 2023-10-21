export const GET_SUBSCRIPTIONS = `
  query GetSubscriptions {
    subscriptionLists {
      id
      fixedRate
      interval
      lastWithdrawTime
      remainingBalance
      startTime
      stopTime
      tokenAddress
      withdrawableCount
      withdrawnBalance
      withdrawnCount
    }
  }
`;
