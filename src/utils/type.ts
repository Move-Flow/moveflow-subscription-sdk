

// Interface for Smart Contract Input Types
export interface CreateSubscriptionInput {
  recipient: string;
  deposit: BigInt;
  tokenAddress: string;
  startTime: BigInt;
  stopTime: BigInt;
  interval: BigInt;
  fixedRate: BigInt;
}


export interface MoveflowConfig {
    chain?: Chain;
    apiKey?: string;
    apiBaseUrl?: string;
  }


  export enum Chain {
    Goerli = "goerli",
    Sepolia = "sepolia",
  }


 

export interface DepositFromSenderInput {
  subscriptionId: BigInt;
  amount: BigInt;
}

export interface WithdrawFromRecipientInput {
  subscriptionId: BigInt;
  amount: BigInt;
}

// Interface for Smart Contract Output Types
export interface CreateSubscriptionOutput {
  // Adjust based on the actual output
}

export interface GetSubscriptionOutput {
  sender: string;
  recipient: string;
  deposit: BigInt;
  tokenAddress: string;
  startTime: BigInt;
  stopTime: BigInt;
  interval: BigInt;
  remainingBalance: BigInt;
  lastWithdrawTime: BigInt;
  withdrawCount: BigInt;
  fixedRate: BigInt;
}


// Interface for Smart Contract Events
export interface CreateSubscriptionEvent extends Event {
  subscriptionId: BigInt;
  sender: string;
  recipient: string;
  deposit: BigInt;
  tokenAddress: string;
  startTime: BigInt;
  stopTime: BigInt;
  interval: BigInt;
  fixedRate: BigInt;
}

export interface WithdrawFromRecipientEvent extends Event {
  subscriptionId: BigInt;
  recipient: string;
  amount: BigInt;
}


export interface RecipientWithdrawLog {
  id: string;
  withdrawAmount: BigInt;
  withdrawTime: BigInt;
  withdrawnCount: BigInt;
}

export interface SenderDepositeLog {
  id: string;
  depositeAmount: BigInt;
  depositeTime: BigInt;
}

export interface SenderWithdrawLog {
  id: string;
  withdrawAmount: BigInt;
  withdrawTime: BigInt;
}

export interface Recipient {
  id: string;
  withdrawnBalance: BigInt;
}

export interface Sender {
  id: string;
  deposit: BigInt;
  withdrawnToRecipient: BigInt;
}

export interface SubscriptionInfo {
  id: string;
  deposit: BigInt;
  fixedRate: BigInt;
  withdrawnBalance: BigInt;
  remainingBalance: BigInt;
  startTime: BigInt;
  stopTime: BigInt;
  interval: BigInt;
  withdrawableCount: BigInt;
  withdrawnCount: BigInt;
  lastWithdrawTime: BigInt;
  recipient: Recipient;
  sender: Sender;
  tokenAddress: string;
  isEntity: boolean;
  recipientWithdrawLog: RecipientWithdrawLog[];
  senderDepositeLog: SenderDepositeLog[];
  senderWithdrawLog: SenderWithdrawLog[];
}

export interface GetSubscriptionsResponse {
  subscriptionLists:  SubscriptionInfo[];
}

