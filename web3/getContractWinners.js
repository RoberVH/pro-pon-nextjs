import { getProponContract } from "./contractsettings"
import { AddressZero } from 'ethers'

/**
 * 
 *  getContractWinners
 *    Read from pro-pon contract the  winners at specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if empty, returns the record with empty values
 */

const NullAddress=AddressZero

export const getContractWinners = async (RFPIndex) => {
  const proponContract = await getProponContract()
  try {
    const Winners = await proponContract.getWinners(RFPIndex)
    // check we really retrieve a valid result (contract will return null but still valid structure object if dound none)
    return { status: true, Winners }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

