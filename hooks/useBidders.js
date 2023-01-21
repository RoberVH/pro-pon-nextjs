/**
 *  useBidders
 *      hook to hold registered participants (invited guest or self registered) to}
 *      an Invitation or Open contest
 */

import { useState, useCallback, useEffect } from 'react'
import { getContractRFPbidders } from '../web3/getContractRFPbidders'
import { getDBCompaniesbyAddress } from '../database/dbOperations'


export const useBidders = (rfpRecord) => {
    const [bidders, setBidders] = useState([])
    const [companies, setCompanies] = useState([])

useEffect(()=>{
    const getCompanies = async () => {
        const results=await getDBCompaniesbyAddress(bidders)
        setCompanies(results)
    }
    getCompanies()
    },[bidders])    

    const getBidders = useCallback(async () => {
        if (!rfpRecord || !rfpRecord.rfpidx)  return
        const participants = await getContractRFPbidders(rfpRecord.rfpidx)
        if (participants.status) { 
            setBidders(participants.bidders)
            return {status:true}
        }
            else return ({status:false, message: message})
    }, [rfpRecord])

    return {bidders, getBidders, companies}

}