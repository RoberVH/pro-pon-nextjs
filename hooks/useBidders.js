/**
 *  useBidders
 *      hook to hold registered participants (invited guest or self registered) to}
 *      an Invitation or Open contest
 */

import { useState, useCallback, useEffect } from 'react'
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
        console.log('getBidders',rfpidx)
        setDoneLookingBidders(false)
        const participants = await getContractRFPbidders(rfpidx)
        if (participants.status) { 
            setBidders(participants.bidders)
            if (participants.bidders) {
                console.log('participants.bidders)',participants.bidders)
                if (participants.bidders.length===0) {
                        setCompanies([]); 
                        setDoneLookingBidders(true); 
                        console.log('set done!!')
                        return
                }
                const results=await getDBCompaniesbyAddress(participants.bidders)
                console.log('result', results)
                setCompanies(results)
                setDoneLookingBidders(true)}            
            return {status:true}
        }
            else return ({status:false, message: message})
    }

    return {bidders, companies, doneLookingBidders, getBidders}

}