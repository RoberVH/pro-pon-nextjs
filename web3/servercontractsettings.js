import { CONTRACT_ADDRESS_DATA} from './proponcontractAddress'
import CONTRACT_DATA_JSON from './pro_ponData.json'
import { ethers } from 'ethers'
import { LOCAL } from '../utils/constants'


// For blockchain read operations at server we use same Alchemy provider that client, pointed at
//  propon Data contract
export const getProponContractServer = async () => {
  try {
    const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SERVER_LINK) 
    const contract = new ethers.Contract(CONTRACT_ADDRESS_DATA, CONTRACT_DATA_JSON.abi, alchemyProvider)
    return contract
    } catch (error) { 
    console.log('contractsettings error', error)
    return undefined
  }
}


