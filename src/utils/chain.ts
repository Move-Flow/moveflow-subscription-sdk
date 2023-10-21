import { ethers, JsonRpcProvider } from 'ethers';
import { Chain } from './type';

export function initializeProvider(chain: Chain): JsonRpcProvider {
  let infuraUrl;

  switch (chain) {
    case Chain.Sepolia:
      infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
      break;
    case Chain.Goerli:
      infuraUrl = 'https://goerli.infura.io/v3/';
      break;
    default:
      throw new Error('Unsupported network');
  }

  return new ethers.JsonRpcProvider(infuraUrl);
}


