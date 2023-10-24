import { ethers, JsonRpcProvider } from "ethers";
import { Chain } from "./type";
require("dotenv").config();

export function initializeProvider(chain: Chain): JsonRpcProvider {
  let infuraUrl;
  const infuraSepoliaID = process.env.infuraSepolia_ID;

  switch (chain) {
    case Chain.Sepolia:
      infuraUrl = `https://sepolia.infura.io/v3/${infuraSepoliaID}`;
      break;
    case Chain.Goerli:
      infuraUrl = "https://goerli.infura.io/v3/";
      break;
    default:
      throw new Error("Unsupported network");
  }

  return new ethers.JsonRpcProvider(infuraUrl);
}
