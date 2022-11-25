import { getProponContract } from "./contractsettings";
import { utils } from 'ethers'

// Read from pro-pon contract the public Constants
// that set PRICE OF RFP, OPEN and INVITATION

export const getCurrentRFPPrices = async () => {
  const proponContract = await getProponContract()
  try {
    const invitationPrice = await proponContract.CREATE_INVITATION_RFP_PRICE();
    const OpenPrice = await proponContract.CREATE_OPEN_RFP_PRICE();
    const rfpInvitationPrice = utils.formatEther(invitationPrice.toNumber())
    const rfpOpenPrice = utils.formatEther(OpenPrice.toNumber())
    return { 
        status: true, 
        openPriceRPF: rfpOpenPrice.toString(), 
        invitationRFPPrice: rfpInvitationPrice.toString()
      }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

export const getCurrentRecordCompanyPrice = async () => {
  const proponContract = await getProponContract()
  try {
    const CompanyPrice = await proponContract.CREATE_COMPANY_PRICE();
    const createCompanyPrice = utils.formatEther(CompanyPrice.toNumber())
    return { 
      status: true, 
      createCoPrice: createCompanyPrice.toString() 
    }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

export const getCurrentParticipantToOpenRFPPrice = async () => {
  const proponContract = await getProponContract()
  try {
    const openRFPPrice = await proponContract.REGISTER_OPEN_RFP_PRICE();
    const participateOpenRFPPrice = utils.formatEther(openRFPPrice.toNumber())
    return { 
      status: true, partOpenRFP: participateOpenRFPPrice.toString()
    }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

export const getMaxOPenParticipantsOpenRFPPrice = async () => {
  const proponContract = await getProponContract()
  try {
    const maxBidderOpenRFP = await proponContract.MAX_GUEST_OPEN_TENDER();
    return { 
      status: true, 
      partOpenRFP: maxBidderOpenRFP.toNumber() 
    }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};


