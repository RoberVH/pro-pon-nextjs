import { CONTRACT_ADDRESS_DATA, CONTRACT_ADDRESS_LOGIC } from './proponcontractAddress'
import CONTRACT_DATA_JSON from './pro_ponData.json'
import CONTRACT_LOGIC_JSON from './pro_ponLogic.json'

import { ethers } from 'ethers'


// For blockchain read operations at client we use web3 browser provider point to propon DATA Contract
export const getProponContract = async () => {
  try {
    const provider=  new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS_DATA, CONTRACT_DATA_JSON.abi, signer)
    return contract
  } catch (error) { 
    return undefined
  }
}

/* 
*  For blockchain writing operations at client we use web3 browser provider point to propon LOGIC Contract
*/
export const getWritingProponContract = async () => {
  try {
    const provider= new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS_LOGIC, CONTRACT_LOGIC_JSON.abi, signer)
    return contract
  } catch (error) { 
    return undefined
  }
}