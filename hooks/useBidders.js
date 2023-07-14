/**
 *  useBidders
 *      hook to hold registered participants (invited guest or self registered) to}
 *      an Invitation or Open contest
 */

import { useState } from 'react'
import { getContractRFPbidders } from '../web3/getContractRFPbidders'
import { getDBCompaniesbyAddress } from '../database/dbOperations'


export const useBidders = () => {
    const [bidders, setBidders] = useState(undefined)
    const [companies, setCompanies] = useState(undefined)
    const [doneLookingBidders, setDoneLookingBidders] = useState(false)

// getBidders
// Look in the contract for all bidders partipating in contrac with index rfpidx, and set it at bidders state var
// then look for company data of the bidders and set it at companies state var
    const getBidders = async (rfpidx) => {
        setDoneLookingBidders(false)
        const participants = await getContractRFPbidders(rfpidx)
        if (participants.status) { 
            setBidders(participants.bidders)
            if (participants.bidders) {
                if (participants.bidders.length===0) {
                        setCompanies([]); 
                        setDoneLookingBidders(true); 
                        return {status:true}
                }
                //testing *********
                // let newBidders = [...participants.bidders]; // Create a copy of the bidders array
                // newBidders.splice(1, 0, '0x0d349b2a88f4e109f'); // Insert buggie address at the second position, there is not company at that
                // console.log('Nuevo arreglo newBidders',newBidders)
                // const results=await getDBCompaniesbyAddress(newBidders)
                //If only one of the adresses couldn't resolve to a company then invalidate the whole package and report error
                //testing *********
                const results=await getDBCompaniesbyAddress(participants.bidders)
                //console.log('useBidder getDBCompaniesbyaddress',participants.bidders)
                setCompanies(results)
                setDoneLookingBidders(true)}       
            return {status:true}
        }
            else {
                setDoneLookingBidders(true)
                return ({status:false, message: participants.message})
            }
    }

    return {bidders, companies, doneLookingBidders, getBidders}

}