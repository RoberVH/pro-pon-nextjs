import { getProponContract } from "./contractsettings";

/**
 * 
 *  getContractRFPbidders
 *    Read from pro-pon contract the list of companies registered to Current RFP
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
 */
export const getContractRFPbidders = async (RFPIndex) => {
  const proponContract = await getProponContract()
  try {
    const bidders = await proponContract.getRFPbyIndex(RFPIndex)
    return { status: true, bidders: bidders.participants }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

