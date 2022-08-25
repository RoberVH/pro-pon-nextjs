import { useContractRead } from 'wagmi'
import { ContractConfig } from '../web3/contractsettings'

export const useGetCompanyDataId = (address) => {
    console.log('useGetCompanyDataId address es',address)
    console.log('useGetCompanyDataId address.toLowerCase() es',(typeof address!=='undefined' ? address.toLowerCase(): 'undefined'))
    const { data } = useContractRead({
        addressOrName: ContractConfig.addressOrName,
        contractInterface:  ContractConfig.contractInterface,
        chainId: ContractConfig.chainId,
        functionName: 'getCompany',
        args:(address ? address: address),
        enabled: Boolean(typeof address !== 'undefined' ),
    })
    console.log('useGetCompanyDataId data por regresar:',data)
    return data
}