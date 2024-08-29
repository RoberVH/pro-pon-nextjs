/**  getRFPCompanyIssuer
 *      Given the index rfpidx of an RFP, get the comapny issuer data
 *      Check if there is a etehreum provider and use it, but if not get it from server

*/

import { getProponContract } from "./contractsettings";
import { parseWeb3Error } from "../utils/parseWeb3Error"
import { getContractCompanyData } from "./getContractCompanyData"




//const issuer= (rfpidx) //getRFPIssuer

export const getRFPCompanyIssuer = async ( rfpidx, t) => {
    if (window.ethereum) {
        const proponContract = await getProponContract()
        const issuerAddress = await proponContract.getRFPIssuer(rfpidx)
        const result= await getContractCompanyData(issuerAddress)
        if (result.status) {
            return {data: result.data}
        }
    } else {
        try {
            let params = new URLSearchParams({rfpidx})
            let url=`/api/getrfpissuercompanyfromserver?${params}`
            let response = await fetch(url,{method: 'GET'})
            let resp = await response.json()
            if (!resp.status) {
                const msgErr= parseWeb3Error(t, resp.error)
                    return({status:false, msg:msgErr})
                }        
            const address = resp.address
            params=new URLSearchParams({address:address})
             url=`/api/getcontractcompanyfromserver?${params}`
            response = await fetch(url,{method: 'GET'})
            resp = await response.json()
            if (!resp.status) {
            const msgErr= parseWeb3Error(t, resp.error)
                return({status:false, msg:msgErr})
            }        
            return {status:true, data:  resp.company}
        } catch (error) {
            const msgErr= parseWeb3Error(t, error)
            return ({status:false, msg:msgErr})
  }


    }
}