// getCompanyDatafromContract

import processBDerror from "../database/processBDerror"
import { parseWeb3Error } from "../utils/parseWeb3Error"
import { connectMetamask } from "./connectMetamask"
import { getContractCompanyData } from "./getContractCompanyData"




export const getCompanyDatafromContract = async (address, t) => {
    //already pending for origin
    if (address & window.ethereum) {
        console.log('local')
        const result= await getContractCompanyData(address)
        if (result.status) {
            return {status:true, data: result.data}
        } else {
            return  {status:false, msg:error.message}
        }
    } else {
        try {
            console.log('server')
            const params=new URLSearchParams({address:address})
            const url=`/api/getcontractcompanyfromserver?${params}`
            const response = await fetch(url,{method: 'GET'})
            const resp = await response.json()

            if (!resp.status) {
            const msgErr= parseWeb3Error(t, resp.error)
                return({status:false, msg:msgErr})
            }        
            return {status:true, data:  resp}
        } catch (error) {
            const msgErr= parseWeb3Error(t, error)
            return ({status:false, msg:msgErr})
  }


    }
}