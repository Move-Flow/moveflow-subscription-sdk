export const GET_SUBSCRIPTIONS = `
query GetSubscriptions($sender: String!) {
  subscriptionLists(where: { sender: $sender }) {
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
}

`;
