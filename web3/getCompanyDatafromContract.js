// getCompanyDatafromContract

import processBDerror from "../database/processBDerror"
import { parseWeb3Error } from "../utils/parseWeb3Error"
import { getContractCompanyData } from "./getContractCompanyData"




export const getCompanyDatafromContract = async (address, t) => {
    //already pending for origin
    if (address & window.ethereum) {
        const result= await getContractCompanyData(address)
        if (result.status) {
            console.log('getCompanyDatafromContract result',result)
            return {data: result.data}
        }
    } else {
        try {
            const params=new URLSearchParams({address:address})
            const url=`/api/getcontractcompanyfromserver?${params}`
            const response = await fetch(url,{method: 'GET'})
            const resp = await response.json()

            if (!resp.status) {
            const msgErr= parseWeb3Error(t, resp.error)
                return({status:false, msg:msgErr})
            }        
            console.log('getCompanyDatafromContract result',resp)
            return {status:true, data:  resp}
        } catch (error) {
            const msgErr= parseWeb3Error(t, error)
            return ({status:false, msg:msgErr})
  }


    }
}