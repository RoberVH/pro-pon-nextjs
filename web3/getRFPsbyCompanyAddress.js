import { getProponContract } from "./contractsettings";
const { utils } = require('ethers');

/**
 * 
 *  getRFPsbyCompanyAddress
 *    Read from pro-pon contract all RFPs from the  specific Company given by its address
 *    companyAddress  - Addres of company to obtain RFPs
 *    if exists it returns record with data
 *    if still doesn't exist, returns the record with empty values
 */


export const getRFPsbyCompanyAddress = async (companyAddress) => {
  if (companyAddress==='' || !utils.isAddress(companyAddress))  return { status: false, msg:'no valid address' }
  try {
    const proponContract = await getProponContract()
    const RFPs = await proponContract.getCompanyRFPs(companyAddress)
        if (RFPs.length === 0) {
          return {status: true, RFPs: []}
         }

        // Convert to integer all big Numbers in the array returned by getCompanyRFP, 
        // with this converted param get the RFP struct from getRFPbyIndex, 
        // and returns an array of objects where each object contains the properties 
        // of an RFP record (name, description, website, etc.) along with the rfpIndex 
        // property substitute by its corresponding integer value.
        const RFPsArray = await Promise.all(RFPs.map(async (rfp) => {
            const rfpRecord = await proponContract.getRFPbyIndex(rfp);
            return { ...rfpRecord, rfpIndex: rfp };
        }))
        return { status: true, RFPs:RFPsArray }
  } catch (error) {
        return({ status: false, message: error.reason });
  }
};
