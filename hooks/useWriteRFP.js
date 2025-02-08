/**
 *  useWriteRFP
 *          Hook to write essential RFP data to pro-pon contract
 *          Essential data meaning minimun Id data on blockchain, there is a correspondant DB MongoDB record to
 *          hold additional data needed to the dApp
 *          Had WAGMI as ethereum provider on browser and Ethers as
 *          Bundlr still doesn't support WAGMI, so I modified the Wagmi Hooks to acommodate as much as 
 *          possible dependent old code
 */
import { ethers } from 'ethers'
import {  useState, useEffect, useRef } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useWriteRFP =  (
  { onError,
    onSuccess,
    onEvent,
    isCancelled,
    setProTxBlockchain
   }) => {

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

        const  write = async (params, value) => {
                const proponContract = await getWritingProponContract()
               // next prevently remove any ppossible listener left behind if user reject in wallet and tries again
              //  const newRFPEventHandler = (address, rfpIdx, rfpName) => {
              //    onEvent(address, rfpIdx, rfpName, params)}
               // Remueve posibles listeners previos
              proponContract.removeAllListeners("NewRFPCreated")
                proponContract.once("NewRFPCreated", (address, rfpIdx, rfpName) => {
                          onEvent(address, rfpIdx, rfpName, params)
                  })
                //proponContract.once("NewRFPCreated", newRFPEventHandler)
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
            setProTxBlockchain(true)
            setPostedHash(Tx.hash)
            //setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
            const data=await Tx.wait()
            if (isMounted.current) {
                    setBlock(data.blockNumber)
                    setBlockchainsuccess(true)
                    onSuccess(data)
             }
        } catch (error) {
                if (isMounted.current) {
                  if (proponContract) {
                    proponContract.removeAllListeners()}
                  onError(error)
                }
        }       
    };
  //  return write
  return {write, postedHash, block,  blockchainsuccess}
};