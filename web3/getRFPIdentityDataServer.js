/**
/** getRFPIdentityData
 * Given a RfpIndex get its indetifyng RFP  data {id, name and issuer} through server api route
  */

export const getRFPIdentityDataServer = async (rfpidx) => {

  try {
    let encodedRfpidx = encodeURIComponent(rfpidx);
    const response = await fetch(`/api/getrfpfromcontract?rfpidx=${encodedRfpidx}`, {method: 'GET'})
    const result = await response.json();
    if (!response.ok) {
      return {status:false, msg:result.msg}
    } 
    return { status: true, RFP:result.rfp }
  } catch (error) {
    return({ status: false, msg: error });
  }
    
}
