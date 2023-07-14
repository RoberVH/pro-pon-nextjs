import { getProponContract } from "./contractsettings";
import { getDocumentsRFPfromServer } from '../web3/getDocumentsRFPfromServer'
import { ethers } from 'ethers'

// Receive global index of RFP.
// Read from pro-pon contract the metadata documents array registered for that RFP
// if exists it returns record with data
// if still doesn't exist, returns the record with empty values
// We can return an object with mesage: <string> if error comes from getDocumentsfromRFP or 
// message: <object> if error was produce on the getProponContract if branch (true of first if)
export const getArweaveFilesMetadata = async (rfpIdx) => {
  try {
    let Documents;
    if (window.ethereum) {
      const proponContract = await getProponContract()
      Documents = await proponContract.getDocumentsfromRFP(rfpIdx)
    } else {
      const result = await getDocumentsRFPfromServer(rfpIdx)

      if (result.status) {
        result.documents.forEach((element,idx) => {
        });
        Documents = result.documents.map((doc) => {
          const docType = ethers.BigNumber.from(doc.docType.hex);
          return {
            ...doc,
            docType,
          };
        });
      } else {
        return {status:false, msg:result.msg}
      }
    }
    return { status: true, docs: Documents }
  } catch (error) {
    return({ status: false, message: error });
  }
};

