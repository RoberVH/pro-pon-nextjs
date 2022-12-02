import { getProponContract } from "./contractsettings";

// Read from pro-pon contract the company record registered to passed address 
// if exists it returns record with data
// if still doesn't exist, returns the record with empty values
export const getArweaveFilesMetadata = async (rfpIdx) => {
  const proponContract = await getProponContract()

  try {
    const Documents = await proponContract.getDocumentsfromRFP(rfpIdx);
    return { status: true, docs: Documents }
  } catch (error) {
    return({ status: false, message: error });
  }
};

