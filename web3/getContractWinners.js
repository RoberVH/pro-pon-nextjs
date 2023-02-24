import { getProponContract } from "./contractsettings";

/**
 * 
 *  getContractWinners
 *    Read from pro-pon contract the  winners at specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if empty, returns the record with empty values
 */

const NullAddress='0x0000000000000000000000000000000000000000'

export const getContractWinners = async (RFPIndex) => {
  const proponContract = await getProponContract()
  try {
    const Winners = await proponContract.getWinners(RFPIndex)
    // check we really retrieve a valid result (contract will return null but still valid structure object if dound none)
    return { status: true, Winners }
  } catch (error) {
    console.log('getContractWinners error', error)
    return({ status: false, message: error.reason });
  }
};

