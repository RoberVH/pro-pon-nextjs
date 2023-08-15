import { CONTRACT_ADDRESS_DATA } from "./proponcontractAddress";
import CONTRACT_DATA_JSON from "./pro_ponData.json";
import { ethers } from "ethers";
import { sortWeb3Error } from "../utils/sortWeb3Error";

// For blockchain read operations at server we use same Alchemy provider that client, pointed at
//  propon Data contract

export const getProponContractServer = async () => {
  try {
    
    const alchemyProvider = new ethers.providers.JsonRpcProvider(
      process.env.ALCHEMY_SERVER_LINK
    );
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS_DATA,
      CONTRACT_DATA_JSON.abi,
      alchemyProvider
    );
    return { status: true, contract: contract };
  } catch (error) {
    const msgErr = sortWeb3Error(error);
    return { status: false, message: msgErr };
  }
};
