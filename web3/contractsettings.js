import { contractAddress } from './proponcontractAddress'
import proponJSONContract from './pro_pon.json'


const proponChainId= 80001         // Polygon Mumbai
// const proponChainId=137         // Polygon Mumbai


export const ContractConfig = {
    addressOrName: contractAddress,
    contractInterface: proponJSONContract.abi,
    chainId: proponChainId
  };
  