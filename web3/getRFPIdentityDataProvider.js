/**getRFPIdentityData
 * Given a RfpIndex get its indetifyng RFP  data {id, name and issuer} through local ethereum provider
  */
import { getProponContract } from "./contractsettings"
import { ethers } from 'ethers'

const NullAddress=ethers.constants.AddressZero

export const getRFPIdentityDataProvider = async (RfpIndex) => {
    const proponContract = await getProponContract()
    try {
        const result = await proponContract.getRFPbyIndex(RfpIndex)
        if (result.issuer=== NullAddress) return {status:false, message:'no_rfp'}
        const RFP = {rfpIndex:result.rfpIndex, name:result.name,description:result.description}
        return { status: true, RFP: RFP }
    } catch (error) {
      return({ status: false, message: error.reason });
    }
  };
    