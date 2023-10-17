

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

// Add other event interfaces as needed
