class CoinAddressStore {
  coinAddress: `0x${string}`;
  smartContractAddress: string;

  constructor() {
    this.coinAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
    this.smartContractAddress = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
  }

  setCoinAddress(c: `0x${string}`) {
    this.coinAddress = c;
  }

  setSmartContractAddress(s: string) {
    this.smartContractAddress = s;
  }
}

const coinAddressStore = new CoinAddressStore();

export default coinAddressStore;
