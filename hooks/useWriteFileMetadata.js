/**
 *  useWriteFileMetadata
 *          Hook to write uploaded file metadata to pro-pon contract
 *          This data is used to guarantee hash files are recorded and files have not been tampered with
 *          Also, it provides a reference of what files belong to the contest
 */

 import { useState, useEffect, useRef } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useWriteFileMetadata =  (onError, isCancelled, setProTxBlockchain) => {
   const [postedHash, setPostedHash] = useState('')
   const [block, setBlock] = useState()
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
   
   const debugstyleprop= 'background-color:yellow; color:red'

   const  write = async (
        rfpId,
        fileType,
        DocumentNames,
        DocumentHashes,
        DocumentIdxs
   ) => {
      const proponContract = await getWritingProponContract()
      // make sure a clean state in case this is second time called
      setBlockchainsuccess(false) 
      setBlock('')
      setPostedHash('')
      try {
         const Tx = await proponContract.addDocuments(
               rfpId,
               fileType,
               DocumentNames,
               DocumentHashes,
               DocumentIdxs 
            )
         setProTxBlockchain(true)
         setPostedHash(Tx.hash)
         const data=await Tx.wait()
         if (isMounted.current) {         
            setBlock(data.blockNumber)
            setBlockchainsuccess(true)
         }
      } catch (error) {
         if (isMounted.current) {         
               onError(error);
               }       
         }
    };
   return {write, postedHash, block,  blockchainsuccess}
};