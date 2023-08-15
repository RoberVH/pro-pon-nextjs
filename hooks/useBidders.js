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