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
      infuraUrl =
        "https://eth-goerli.alchemyapi.io/v2/HYE2oyBJlSlpZCY-dUI8ndfq0NCpWwvT";
      break;
    default:
      throw new Error("Unsupported network");
  }
  //
  https: return new ethers.JsonRpcProvider(infuraUrl);
}
