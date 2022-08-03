import { contractAddress } from './proponcontractAddress'
import proponJSONContract from './pro_pon.json'
import { proponChainId  } from './constants'

export const ContractConfig = {
    addressOrName: contractAddress,
    contractInterface: proponJSONContract.abi,
    chainId: proponChainId
  };
  