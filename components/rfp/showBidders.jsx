
/**
 * ShowBidders
 *  Show all current bidders and uploaded documents and (dates of uploading?)
 *  Show command in current bidder if there is one to open a upload to buildr panel
 *  show balance o bundlr account if is open contest
 *  In case it needs more balance, allow to transfer more matics to fund bundlr, this is needs 
 *  to be coordinated with upload screen when we know how much its requested
 */

import { useEffect, useState } from "react";

const ShowBidders = ({bidders}) => {
    const [Bidders, setBidders] = useState([])
    console.log('showbidders',bidders)

useEffect(()=>{
    console.log('showbidders biddersx',bidders)
    
},[])    
    return (
    <div>
        ShowBidders
        {bidders?.length ?
            bidders.map(bidder => <p className="p-4 text-blue-800" 
                key={bidder}>{`${bidder} - ${bidder.companyName}`}</p>)
            :
            <p>NO BIDDERS</p>
        }
        {console.log('ShowBidders')}
    </div>
    )
};
export default ShowBidders;