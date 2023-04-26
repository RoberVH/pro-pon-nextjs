/**
 *  useRegisterBidders
 *          Hook to write guests accounts to RFP contract's array var participants
 *          
 */

import { ethers } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import { getWritingProponContract } from "../web3/contractsettings";

export const useRegisterBidders =  (onError, onSuccess, isCancelled) => {
   const [postedHash, setPostedHash] = useState('')
   const [block, setBlock] = useState('')
   const [link, setLink] = useState('')
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


   // const debugstyleprop= 'background-color:yellow; color:red'

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
         const proponContract = await getWritingProponContract()
      // make sure a clean state in case this is consecutive second time called
      setBlockchainsuccess(false) 
      setBlock('')
      setLink('')
      setPostedHash('')
      let Tx;
      try {
         if (registerType==='inviteguests'){
            Tx = await proponContract.inviteCompaniestoRFP(
               rfpidx,
               companyId,
               guestsCompanies
               )
            } else  {
             Tx = await proponContract.registertoOpenRFP(
               rfpidx,      
               {value: ethers.utils.parseEther("0.0001")})
            }
      setPostedHash(Tx.hash)
      setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`)
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
   return {write, postedHash, block, link, blockchainsuccess}
};