// list of subscriptions and subscription data for a sender
export const GET_SENDER_SUBSCRIPTIONS = `
query GetSubscriptions($sender: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
  subscriptionLists(where: { sender: $sender }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
    id
    fixedRate
    sender {
      id
    }
    interval
    recipient {
      id
    }
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
}`;

export const GET_Recipient_SUBSCRIPTIONS = `
query GetSubscriptions($recipient: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
  subscriptionLists(where: { recipient: $recipient }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
    id
    sender {
      id
    }
    recipient {
      id
    }
    tokenAddress
    deposit
    remainingBalance
    startTime
    stopTime
    interval
    fixedRate
    lastWithdrawTime
    isEntity
    withdrawableCount
    withdrawnBalance
    withdrawnCount
  }
}
`;

// withdrawFromRecipient log using the subscription ID
export const GET_WITHDRAW_From_RECIPIENT_LOG = `
  query GetSenderWithdrawLog($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    subscriptionList(id: $id) {
      recipient {
        id
      }
      senderWithdrawLog(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
        withdrawTime
        withdrawAmount
      }
    }
  }
`;

//  depositeFromSender log using the subscription ID
export const GET_SENDER_WITHDRAW_LOG = `
query GetSenderDepositLog($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
  subscriptionList(id: $id) {
    sender {
      id
    }
    senderDepositeLog(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      depositeTime
      depositeAmount
    }
  }
}
`;

export const GET_SENDER_DEPOSIT_LOG = `
query GetSenderDepositLog($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
  subscriptionList(id: $id) {
    sender {
      id
    }
    senderDepositeLog(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      depositeTime
      depositeAmount
    }
  }
}
`;

// Query the Overall by a sender
export const GET_SENDER_INFO = `
  query GetSenderInfo($id: String!) {
    sender(id: $id) {
      id
      deposit
      withdrawnToRecipient
    }
  }
`;

// Query the Overall by a Recipient
export const GET_RECIPIENT_INFO = `
  query GetRecipientInfo($id: String!) {
    recipient(id: $id) {
      id
      withdrawnBalance
    }
  }
`;

// all depositeFromSender logs for all subscriptions by a sender
export const GET_SENDER_DEPOSIT_LOG_ALL = `
  query GetSenderDepositLog($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    sender(id: $id) {
      id
      senderDepositeLog(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
        depositeTime
        depositeAmount
      }
    }
  }
`;

// all withdrawFromRecipient logs for all subscriptions by a recipient
export const GET_RECIPIENT_WITHDRAW_LOG = `
  query GetRecipientWithdrawLog($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    recipient(id: $id) {
      id
      recipientWithdrawLog(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
        withdrawTime
        withdrawAmount
      }
    }
  }
`;
export const GET_SENDER_SUBSCRIPTIONS_WITH_RECIPIENT_FILTER = `
  query GetSenderSubscriptionsWithRecipientFilter($senderId: String!, $recipientId: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    sender(id: $senderId) {
      subscriptions(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: { recipient_: { id: $recipientId } }
      ) {
        id
        sender {
          id
        }
        recipient {
          id
        }
        tokenAddress
        deposit
        remainingBalance
        startTime
        stopTime
        interval
        fixedRate
        lastWithdrawTime
        isEntity
        withdrawableCount
        withdrawnBalance
        withdrawnCount
      }
    }
  }
`;
