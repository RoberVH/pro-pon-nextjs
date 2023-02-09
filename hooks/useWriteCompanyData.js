import { ethers } from 'ethers'
import { getWritingProponContract } from "../web3/contractsettings";

// Have to change WAGMI to ethereum provider on browser and Ethers as
// Bundlr still doesn't support WAGMI, so I modified the Wagmi Hooks to acommodate as much as 
// possible dependent old code

// Write Company Data (essential) to  pro-pon contract 
export const useWriteCompanyData =  (
  { onError,
    onSuccess,
    onEvent,
    setHash,
    setLink,
    setPosted}) => {

    const write = async (companyId,companyname, country,value) => {
        const proponContract = await getWritingProponContract()
        proponContract.on("NewCompanyCreated", (address, companyId, CompanyName) => {
                onEvent(address, companyId, CompanyName)
        })
        try {
           const Tx = await proponContract.createCompany(
                companyId,
                companyname, 
                country, 
                {value: ethers.utils.parseEther(value)}
                )
          setPosted(true)
          setHash(Tx.hash)
          setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
          const data=await Tx.wait()
          onSuccess(data)
        } catch (error) {
                onError(error);
                }       
    };

   return write
};
