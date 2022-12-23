import {  getProponContractServer } from './servercontractsettings'
//import {  getProponContract } from './contractsettings'



export const accountHasRigths =async (accountAddress, companyId) => {
    const proponContract = await getProponContractServer()
    //const proponContract = await getProponContract()
    const _companyId = await proponContract.getCompanyId(accountAddress)
    return (_companyId === companyId)
}