import { ethers, JsonRpcProvider } from "ethers";
import { Chain } from "./type";
require("dotenv").config();

export function initializeProvider(chain: Chain): JsonRpcProvider {
  let infuraUrl;
  const infuraID = process.env.infura_ID;

  switch (chain) {
    case Chain.Sepolia:
      infuraUrl = `https://sepolia.infura.io/v3/${infuraID}`;
      break;
    case Chain.Goerli:
      infuraUrl = `https://goerli.infura.io/v3/${infuraID}`;
      break;
    default:
      throw new Error("Unsupported network");
  }
  //
  https: return new ethers.JsonRpcProvider(infuraUrl);
}
// variables
