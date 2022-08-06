import  { ethers }  from "ethers"
import { ContractConfig } from '../utils/contractsettings'



export const accountHasRigths =async (accountAddress, companyId) => 
{
    const alchemyProvider = new ethers.providers.AlchemyProvider(process.env.NEXT_PUBLIC_NETWORK, process.env.NEXT_PUBLIC_ALCHEMY_ID_DEV);
    const signer = new ethers.Wallet(process.env.PVTE_KEY, alchemyProvider)
    const proponContract = new ethers.Contract(
            ContractConfig.addressOrName, 
            ContractConfig.contractInterface, 
            signer)
    const _companyId = await proponContract.getCompanyId(accountAddress)
    return (_companyId === companyId)

    
}