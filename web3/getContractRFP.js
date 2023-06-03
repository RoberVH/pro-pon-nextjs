import { getProponContract } from "./contractsettings";

/**
 * 
 *  getContractRFP
 *    Read from pro-pon contract the specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
 */

const NullAddress='0x0000000000000000000000000000000000000000'

export const getContractRFP = async (RFPIndex) => {
  const proponContract = await getProponContract()
  try {
    const RFP = await proponContract.getRFPbyIndex(RFPIndex)
    // check we really retrieve a valid result (contract will return null but still valid structure object if found none)
    if (RFP.issuer  === NullAddress) return { status: false, message:'NO RFP' }
    return { status: true, RFP:RFP }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

