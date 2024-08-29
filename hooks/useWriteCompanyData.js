import { ethers } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

// Have to change WAGMI to ethereum provider on browser and Ethers as
// Bundlr still doesn't support WAGMI, so I modified the Wagmi Hooks to acommodate as much as 
// possible dependent old code

// Write Company Data (essential) to  pro-pon contract 

export const useWriteCompanyData =  (
  { onError,
    onSuccess,
    isCancelled,
    setProTxBlockchain}) => {
    const [postedHash, setPostedHash] = useState('')
    const [block, setBlock] = useState('')
    const [blockchainsuccess, setBlockchainsuccess] = useState(false)
    
    const isMounted = useRef(true)
    useEffect(() => {
      if (isCancelled) {
        isMounted.current = false;
      } else {
        isMounted.current = true;
      }
      return () => {
        isMounted.current = false;
      };
    }, [isCancelled]);

    const write = async (companyId,companyname, country,value) => {
        const proponContract = await getWritingProponContract()
        try {
           const Tx = await proponContract.createCompany(
                companyId,
                companyname, 
                country, 
                {value: ethers.utils.parseEther(value)}
                )
          setProTxBlockchain(true)
          setPostedHash(Tx.hash)
          const data=await Tx.wait()
          if (isMounted.current) {
            setBlock(data.blockNumber)
            setBlockchainsuccess(true)
            onSuccess(data)
          }
        } catch (error) {
            if (isMounted.current) {          
                  onError(error);
                  }       
            }
    };

   return {write, postedHash, block, blockchainsuccess}
};
