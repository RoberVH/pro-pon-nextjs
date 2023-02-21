/**
 *  useDeclareRsults
 *          Hook to write declaration of RFP winners/deserted items
 *          
 */

import { ethers } from 'ethers'
import { useState } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useDeclareResults =  (onError, onSuccess) => {
   const [postedHash, setPostedHash] = useState()
   const [block, setBlock] = useState()
   const [link, setLink] = useState()
   const [blockchainsuccess, setBlockchainsuccess] = useState(false)
   
   // const debugstyleprop= 'background-color:yellow; color:red'

 
   // write
   //    Receives rfpidx - global Id of RFP
   //    winners - array with minimum length of 1 with address of companis winning each item
   //    companyId - Id of the issuer company
   //    if winners[i] is address(0) it means item[i] is deserted
   const  write = async (
      rfpidx,
      companyId,
      winners
      ) => {
         const proponContract = await getWritingProponContract()
      // make sure a clean state in case this is consecutive second time called
      setBlockchainsuccess(false) 
      setBlock(false)
      setLink(false)
      setPostedHash(false)
      try {
         const Tx = await proponContract.declareWinners(
            rfpidx,
            companyId,
            winners
            )
         setPostedHash(Tx.hash)
         setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
         const data=await Tx.wait()
         setBlock(data.blockNumber)
         setBlockchainsuccess(true)
         onSuccess()
      } catch (error) {
            onError(error);
      }       
   };
   return {write, postedHash, block, link, blockchainsuccess}
};