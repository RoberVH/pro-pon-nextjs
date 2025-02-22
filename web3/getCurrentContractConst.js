import { getProponContract } from "./contractsettings";
import {  formatEther } from 'ethers'

// Read from pro-pon contract the public Constants
// that set PRICE OF RFP, OPEN and INVITATION

export const getCurrentRFPPrices = async () => {
  const proponContract = await getProponContract()
  try {
    const invitationPrice = await proponContract.CREATE_INVITATION_RFP_PRICE();
    const OpenPrice = await proponContract.CREATE_OPEN_RFP_PRICE();
    const rfpInvitationPrice = formatEther(invitationPrice)
    const rfpOpenPrice = formatEther(OpenPrice)
    return { 
        status: true, 
        openPriceRPF: rfpOpenPrice, 
        invitationRFPPrice: rfpInvitationPrice
      }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

/**
 * Fetches the current price for creating a record company.
 *
 * @returns {Object} An object containing the status of the request and either the createCoPrice
 *                   or an error message.
 */
export const getCurrentRecordCompanyPrice = async () => {
  const proponContract = await getProponContract()
  try {
    const CompanyPrice = await proponContract.CREATE_COMPANY_PRICE();
    const createCompanyPrice = formatEther(CompanyPrice)
    return { 
      status: true, 
      createCoPrice: createCompanyPrice 
    }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

export const getCurrentParticipantToOpenRFPPrice = async () => {
  const proponContract = await getProponContract()
  try {
    const openRFPPrice = await proponContract.REGISTER_OPEN_RFP_PRICE();
    const participateOpenRFPPrice = formatEther(openRFPPrice)
    return { 
      status: true, partOpenRFPPrice: participateOpenRFPPrice
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


