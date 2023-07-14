/**
 * 
 *  getDocumentsRFPfromServer
 *    Read from pro-pon contract the  metadata of Documents belonging to the specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if empty, returns the record with empty values
 *    if there is an error, we could return one of two objets:
 *      { status: false, msg:<string Id of error>}
 *      { status: false, messsage:error object}
 */


export const getDocumentsRFPfromServer = async (RFPIndex) => {
  try {
    let encodedRfpidx = encodeURIComponent(RFPIndex);
    const response = await fetch(`/api/getcontractdocfromserver?rfpidx=${encodedRfpidx}`, {method: 'GET'})    
    const result = await response.json();
    if (!response.ok) {
      return {status:false, msg:result.msg}
    } 
    return { status: true, documents:result.documents }
  } catch (error) {
    return({ status: false, msg: error });
  }
};

