/**
 *  useDeclareRsults
 *          Hook to write declaration of RFP winners/deserted items
 *          
 */

import { ethers } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useDeclareResults =  (onError, onSuccess, isCancelled, setProTxBlockchain) => {
   const [postedHash, setPostedHash] = useState('')
   const [block, setBlock] = useState('')
   //const [link, setLink] = useState('')
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
   
   const  write = async (
      rfpidx,
      companyId,
      winners,
      cancel
      ) => {
         const proponContract = await getWritingProponContract()
      // make sure a clean state in case this is consecutive second time called
      setBlockchainsuccess(false) 
      setBlock('')
      setPostedHash('')
      let Tx;
      try {
         if (cancel) {
            Tx = await proponContract.cancelRFP(
               companyId,
               rfpidx)}
          else
            Tx =  await proponContract.declareWinners(
               rfpidx,
               companyId,
               winners)
            setProTxBlockchain(true)
            setPostedHash(Tx.hash)
            const data=await Tx.wait()
            if (isMounted.current) {
               setBlock(data.blockNumber)
               setBlockchainsuccess(true)
               onSuccess() 
            }
      } catch (error) {
         if (isMounted.current) {
            onError(error);
         }   
      }       
   };
   return {write, postedHash, block,  blockchainsuccess}
};