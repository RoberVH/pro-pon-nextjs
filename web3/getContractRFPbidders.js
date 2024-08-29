import { getProponContract } from "./contractsettings";
import  { getContractRFPFromServer } from '../web3/getContractRFPFromServer'

/**
 * 
 *  getContractRFPbidders
 *    Read from pro-pon contract the list of companies registered to Current RFP
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
 *    Is called by useBidders hook.
 *    
 */
export const getContractRFPbidders = async (RFPIndex) => {
  try {
    let bidders;
    //throw new Error('address_already_admin')
    if (window?.ethereum ) {
        const proponContract = await getProponContract()
        bidders = await proponContract.getRFPbyIndex(RFPIndex)
      } else  {
        const result =  await getContractRFPFromServer(RFPIndex)
        if (result.status) {
          bidders = result.RFP
        } else throw new Error(result.message)
      }
      return { status: true, bidders: bidders.participants }
  } catch (error) {
    return({ status: false, message: error.message });
  }
};

