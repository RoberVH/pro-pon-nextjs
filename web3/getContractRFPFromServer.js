import { getProponContract } from "./contractsettings"
const { ethers } = require('ethers');



/**
 * 
 *  getContractRFP
 *    Ask server to read the RFP from the contract the specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
*/

const NullAddress = ethers.constants.AddressZero

export const getContractRFPFromServer = async (RFPIndex) => {
  // call a route
  try {
    //throw new Error('execution reverted: already_participating')
    let encodedRfpidx = encodeURIComponent(RFPIndex);
    const response = await fetch(`/api/getrfpfromcontract?rfpidx=${encodedRfpidx}`, {method: 'GET'})    
    const result = await response.json();
    // in GET methods we rather check the object passed in result that response.ok!!!
    if (!result.status) {
      return({ status: false, message: result.message});
  } else  {
      const RFP=result.rfp
      // check we really retrieve a valid result (contract will return null but still valid structure object if found none)
      if (RFP.issuer  === NullAddress) return { status: false, message:'NO RFP' }
      return { status: true, RFP:RFP }
    } 
  } catch (error) {
    return({ status: false, message: error.message});
  }
};

