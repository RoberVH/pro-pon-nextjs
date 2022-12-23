/**
 *  useWriteFileMetadata
 *          Hook to write uploaded file metadata to pro-pon contract
 *          This data is used to guarantee hash files are recorded and files have not been tampered with
 *          Also, it provides a reference of what files belong to the contest
 */

 import { useState } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useWriteFileMetadata =  (onError) => {
   const [postedHash, setPostedHash] = useState()
   const [block, setBlock] = useState()
   const [link, setLink] = useState()
   const [blockchainsuccess, setBlockchainsuccess] = useState(false)
   
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
      setBlock(false)
      setLink(false)
      setPostedHash(false)
      try {
         const Tx = await proponContract.addDocuments(
               rfpId,
               fileType,
               DocumentNames,
               DocumentHashes,
               DocumentIdxs 
            )
         setPostedHash(Tx.hash)
         setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
         const data=await Tx.wait()
         setBlock(data.blockNumber)
         setBlockchainsuccess(true)
      } catch (error) {
               onError(error);
               }       
    };
   return {write, postedHash, block, link, blockchainsuccess}
};