// CoinAddressStore.ts
class CoinAddressStore {
    coinAddress: `0x${string}`;
  
    constructor() {
      this.coinAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
    }
  
    setCoinAddress(c: `0x${string}`) {
      this.coinAddress = c;
    }
  }
  
  const coinAddressStore = new CoinAddressStore();
  
  export default coinAddressStore;
  