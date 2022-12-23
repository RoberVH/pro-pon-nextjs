/**
 *  useWriteFileMetadata
 *          Hook to write uploaded file metadata to pro-pon contract
 *          This data is used to guarantee hash files are recorded and files have not been tampered with
 *          Also, it provides a reference of what files belong to the contest
 */

 import { useState } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useRegisterBidders =  (onError) => {
   const [postedHash, setPostedHash] = useState()
   const [block, setBlock] = useState()
   const [link, setLink] = useState()
   const [blockchainsuccess, setBlockchainsuccess] = useState(false)
   
   const debugstyleprop= 'background-color:yellow; color:red'

   /**
    * write 
    * registerType = 'inviteguest' it means we'll register companies guest for Invite Contest
    *    rfpidx - Absolute index in RFPs contracts mapping var
    *    companyId - Id of RFP owner company
    *    guestCompanies - Array of string representing account address of invited companies  
    *    Record to contract all invited companies to an open contest
    * 
    * registerType = 'registerself' it means a company is self- registering to an Open Contest
    *    rfpidx - Absolute index in RFPs contracts mapping var
    *    Record to contract the sender address for a Open Contest
    *    
   */ 
   const  write = async (
      registerType,
      rfpidx,
      companyId,
      guestsCompanies
      ) => {
         console.log('%cWRITE: ','background-color:blue;', registerType,rfpidx, companyId, guestsCompanies )
         const proponContract = await getWritingProponContract()
      // make sure a clean state in case this is consecutive second time called
      setBlockchainsuccess(false) 
      setBlock(false)
      setLink(false)
      setPostedHash(false)
      let Tx;
      try {
         if (registerType==='inviteguests'){
            Tx = await proponContract.inviteCompaniestoRFP(
               rfpidx,
               companyId,
               guestsCompanies
               )
            } else  
             Tx = await proponContract.registertoOpenRFP(
               rfpidx
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