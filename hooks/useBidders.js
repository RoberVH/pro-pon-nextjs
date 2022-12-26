import { useState, useEffect } from 'react'

export const  useBidders= () => {
    const [biddersx, setBiddersx] = useState([])

    const  refreshBidders= () => {
        console.log('refreshBidders')
        if (biddersx.length===0)
        {setBiddersx(
        [{
            companyId:'0394-4572-34',
            companyName:'Dreisys Systems, Inc',
            address:'0xd4855bE53404C9Bc327f17BFA9756D94D423D8D0'
        }, 
        {
            companyId:'478-200419-512',
            companyName:'Tamesis Financial Services, Inc',
            address:'0x15709b3d6a25cd55e0937d2620ab0deeb5f7a4f0123b'}],
            ) }
            else {
                setBiddersx(prev=> 
            [...prev, {
                companyId:'20039-6553-09',
                companyName:'Tokamak Medical, Inc',
                address:'0xb04d4be0d9Bc327f17BFA9756D94D4227cb4'
            }, 
            {
                companyId:'1002-30994-768',
                companyName:'Montes  Services, Inc',
                address:'0x15709b3d6a25cd55e0937d2620ab0deeb5f7a4f0123b'}],
                )   
            }

    }
    
    
    
return {biddersx, refreshBidders}
}