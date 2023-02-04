import { getProponContract } from "./contractsettings";

/**
 * 
 *  getContractRFP
 *    Read from pro-pon contract the specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
 */
export const getContractRFP = async (RFPIndex) => {
  const proponContract = await getProponContract()
  try {
    const RFP = await proponContract.getRFPbyIndex(RFPIndex)
   console.log('RFP***', RFP)
    return { status: true, RFP:RFP }
  } catch (error) {
    console.log('getContractRFP error', error)
    return({ status: false, message: error.reason });
  }
};

