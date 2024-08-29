
/**
 * 
 *  getContractWinnersFromServer
 *    Read from pro-pon contract the  winners at specific RFP given in RFPIndex
 *    RFPIndex  - Absolut index of RFP contract record
 *    if exists it returns record with data
 *    if empty, returns the record with empty values
 */


export const getContractWinnersFromServer = async (RFPIndex) => {
  try {
    let encodedRfpidx = encodeURIComponent(RFPIndex);
    const response = await fetch(`/api/getcontractwinnersfromserver?rfpidx=${encodedRfpidx}`, {method: 'GET'})    
    if (!response.ok) {
      return({ status: false, message: response.message});
  }
    const result = await response.json();
    return { status: true, Winners:result.winners }
  } catch (error) {
    return({ status: false, error: error });
  }
};

