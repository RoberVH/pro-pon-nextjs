import { CONTRACT_ADDRESS } from './proponcontractAddress'
import CONTRACT_ABI from './pro_pon.json'
import { ethers } from 'ethers'
import { LOCAL } from '../utils/constants'


// For blockchain read operations at server we use same Alchemy provider that client, it could change in future verions
export const getProponContractServer = async () => {
  try {
    if (!LOCAL) { 
    const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_SERVER) 
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, alchemyProvider)
    return contract
  } else {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, provider)
    return contract

  }

  } catch (error) { 
    console.log('contractsettings error', error)
    return undefined
  }
}


