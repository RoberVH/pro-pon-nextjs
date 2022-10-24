import { getProponContract } from "./contractsettings";

// Read from pro-pon contract the company record registered to passed address 
// if exists it returns record with data
// if still doesn't exist, returns the record with empty values
export const getContractCompanyData = async (address) => {
  const proponContract = await getProponContract()

  try {
    const companyData = await proponContract.getCompany(address);
    return { status: true, data: companyData }
  } catch (error) {
    return({ status: false, message: error.reason });
  }
};

