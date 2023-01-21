import { ethers } from 'ethers'
import { getProponContract } from "./contractsettings";


// Write Company Data (essential) to  pro-pon contract 
export const writeCompanyDatatoContract = async (
        companyId,
        companyname, 
        country,
        value) => {
    const proponContract = await getProponContract()
    try {
    const createCompanyTx = await proponContract.createCompany(
            companyId,
            companyname, 
            country, {value: ethers.utils.parseEther(value)})
    await createCompanyTx.wait()
    return { status: true, data: companyData }
    } catch (error) {
    return({ status: false, message: error.reason });
    }
    };