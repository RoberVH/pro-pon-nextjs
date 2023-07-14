import { getProponContract } from "./contractsettings";

/**
 * Retrieve the company record registered from the Propon smart contract, given a passed address
 * if exists it returns record with data
 * if doesn't exist, returns the record with empty values
 * @async
 * @param {string} address - Ethereum address of the company
 * @returns {Promise<Object>} Return a promise object with the company data or error message
 */
export const getContractCompanyData = async (address) => {
  try {
    const proponContract = await getProponContract()
    const companyData = await proponContract.getCompany(address)
        return { status: true, data: companyData }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

