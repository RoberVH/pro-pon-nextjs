import { CONTRACT_ADDRESS } from './proponcontractAddress'
import CONTRACT_ABI from './pro_pon.json'
import { ethers } from 'ethers'
import { PRODUCTION, LOCAL } from '../utils/constants'


// For blockchain read operations at client we use an Alchemy provider
export const getProponContract = async () => {
  try {
    if (!LOCAL) {  
      //const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_URL) 
      const alchemyProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_BROWSER) 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, alchemyProvider)
      return contract
    } else {
      const provider=  new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer)
      return contract
    }
  } catch (error) { 
    console.log('contractsettings error', error)
    return undefined
  }
}

/* To still use ethers and write contract we use window.ethereum provider
* if Metamask, then link to blockchain is provided by Metamask, if Coinbase then by them etc
* This is a shortcut but in next version it should use better alchemy library and RPC api
* to send this trough alchemy node. 
* for this make encode contract and use ethereum.request( method: "eth_sendTransaction",..)..
*/
export const getWritingProponContract = async () => {
  try {
    const provider= await new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer)
    return contract

  } catch (error) { 
    console.log('propon error', error)
    return undefined
  }
}