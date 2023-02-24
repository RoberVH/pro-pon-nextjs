/**
 *  useWriteRFP
 *          Hook to write essential RFP data to pro-pon contract
 *          Essential data meaning minimun Id data on blockchain, there is a correspondant DB MongoDB record to
 *          hold other much longer data needed to the dApp
 *          Have WAGMI to ethereum provider on browser and Ethers as
 *          Bundlr still doesn't support WAGMI, so I modified the Wagmi Hooks to acommodate as much as 
 *          possible dependent old code
 */
import { ethers } from 'ethers'
import { getWritingProponContract } from "../web3/contractsettings";

export const useWriteRFP =  (
  { onError,
    onSuccess,
    onEvent,
    setPostedHash,
    setLink //,setPosted
   }) => {

        const  write = async (params, value) => {
                const proponContract = await getWritingProponContract()
                const listeners = proponContract.listeners("NewRFPCreated")
                proponContract.once("NewRFPCreated", (address, rfpIdx, rfpName) => {
                        onEvent(address, rfpIdx, rfpName, params)
        })
        try {
            const Tx = await proponContract.createRFP(
                    params.name,
                    params.description,
                    params.rfpwebsite,
                    params.openDate, 
                    params.endReceivingDate,
                    params.endDate,
                    params.contestType,
                    params.items,    
                    {value: ethers.utils.parseEther(value)})
            //setPosted(true)
            setPostedHash(Tx.hash)
            setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
            const data=await Tx.wait()
            onSuccess(data)
        } catch (error) {
                onError(error);
                }       
    };
   return write
};