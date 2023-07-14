import {  getProponContractServer } from './servercontractsettings'
import { NullAddress } from '../utils/constants'
import { sortWeb3Error } from '../utils/sortWeb3Error'

export const accountHasRigths =async (accountAddress, companyId) => {
    const proponContract = await getProponContractServer()
    const _companyId = await proponContract.getCompanyId(accountAddress)
    return (_companyId === companyId)
}

export const getRFP= async (rfpIdx) => {
  try {
    const result = await getProponContractServer() 
      if (!result.status) throw new Error(result.message)
      const proponContract = result.contract
      const RFP = await proponContract.getRFPbyIndex(rfpIdx)
      // check we really retrieve a valid result (contract will return null but still valid structure object if dound none)
      if (RFP.issuer  === NullAddress) return { status: false, message:'NO RFP' }
      return { status: true, RFP:RFP }
    } catch (error) {
      const msgErr=sortWeb3Error(error)
      return({ status: false, message: msgErr });
    }
  };

  // Get the array of RFP globalIdx belonging to passed account address
  export const getCompanyRFPs = async (accountAddress) => {
    const proponContract = await getProponContractServer()
    try {
      // change to this line as soon as you update the contract with this new method!!
      //const contractRFPArray = await proponContract.getCompanyRFPs(accountAddress)
      
      // meanwhile let's proof with this workaround
      const contractRFPArray = await proponContract.getCompany(accountAddress).company_RFPs
      //*************************************************************************** end of workaround */
      const companyRFPs = contractRFPArray.map(elem => parseInt(elem.toString()))
      return { status: true, RFP:companyRFPs }
    } catch (error) {
      return({ status: false, message: error.reason });
    }
  }