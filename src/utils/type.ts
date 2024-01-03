// Input Types
export interface CreateSubscriptionInput {
  recipient: string;
  deposit: BigInt;
  tokenAddress: string;
  startTime: BigInt;
  stopTime: BigInt;
  interval: BigInt;
  fixedRate: BigInt;
}

export interface DepositFromSenderInput {
  subscriptionId: BigInt;
  amount: BigInt;
}

export interface MoveflowConfig {
  chain?: Chain;
  apiKey?: string;
  apiBaseUrl?: string;
}

export enum Chain {
  Goerli = "goerli",
  Sepolia = "sepolia",
  Lightlink_Testnet="lightlink-testnet",
  Lightlink="lightlink",
}

export interface WithdrawFromRecipientInput {
  subscriptionId: BigInt;
  amount: BigInt;
}

export interface GetSubscriptionInput {
  subscriptionId: BigInt;
}

// Output Types
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

export interface GetOverallDataResponse {
  senderData: SenderData;
}

export interface SenderData {
  id: string;
  deposit: BigInt;
  withdrawnToRecipient: BigInt;
}

export interface GetDepositLogsResponse {
  depositLogs: DepositLog[];
}

export interface DepositLog {
  depositeTime: BigInt;
  depositeAmount: BigInt;
}

// Event Types
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
}

interface SenderWithdrawLog {
  id: string;
  withdrawAmount: BigInt;
  withdrawTime: BigInt;
}

// depositeFromSender log
export interface Sender {
  id: string;
}

export interface SenderDepositeLog {
  depositeTime: number;
  depositeAmount: number;
}

export interface GetDepositeFromSenderLogData {
  subscriptionList: SubscriptionListDepo;
}

export interface SubscriptionListDepo {
  sender: Sender;
  senderDepositeLog: SenderDepositeLog;
}

// withdrawFromRecipient log types

interface RecipientLog {
  id: string;
}

interface WithdrawLog {
  withdrawAmount: BigInt;
  withdrawTime: BigInt;
}

export interface SubscriptionLogListRecipient {
  recipient: RecipientLog;
  senderWithdrawLog: WithdrawLog;
}

export interface GetWithdrwaFromRecipientLogData {
  subscriptionList: SubscriptionLogListRecipient;
}

export interface SenderWithdrawLogResponse {
  subscriptionList: {
    senderWithdrawLog: SenderWithdrawLog[];
  };
}

// overall by a Sender types
export interface SenderInfo {
  id: string;
  deposit: number;
  withdrawnToRecipient: number;
}

export interface GetSenderInfoData {
  sender: SenderInfo;
}
// overall by a recipient types
export interface RecipientInfo {
  id: string;
  withdrawnBalance: number;
}

export interface GetRecipientInfoData {
  recipient: RecipientInfo;
}

export interface SenderDepositeLogAll {
  depositTime: number;
  depositAmount: number;
}

export interface GetSenderDepositeLogAllData {
  sender: {
    id: string;
    senderDepositeLog: SenderDepositeLogAll[];
  };
}

export interface RecipientWithdrawLog {
  withdrawTimeRecipient: number;
  withdrawAmountsRecipient: number;
}

export interface SenderSubscription {
  id: string;
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  tokenAddress: string;
  deposit: number;
  remainingBalance: number;
  startTime: number;
  stopTime: number;
  interval: string;
  fixedRate: string;
  lastWithdrawTime: number;
  isEntity: boolean;
  withdrawableCount: number;
  withdrawnBalance: number;
  withdrawnCount: number;
}

export interface GetSenderSubscriptionsData {
  sender: {
    subscriptions: SenderSubscription[];
  };
}
export interface GetRecipientWithdrawLogData {
  recipient: {
    id: string;
    recipientWithdrawLog: RecipientWithdrawLog[];
  };
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
  recipient: RecipientInfo;
  sender: Sender;
  tokenAddress: string;
  isEntity: boolean;
  recipientWithdrawLog: RecipientWithdrawLog[];
  senderDepositeLog: SenderDepositeLog[];
  senderWithdrawLog: SenderWithdrawLog[];
}

export interface GetSubscriptionsSenderResponse {
  subscriptionLists: SubscriptionInfo[];
}

export interface GetSubscriptionsByRecipientResponse {
  subscriptionLists: SubscriptionInfo[];
}

export interface GetRecipientSubscriptionsParams {
  recipientId: string;
  first: number;
  skip: number;
  orderBy: string;
  orderDirection: string;
}
