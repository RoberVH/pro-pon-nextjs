import { useContractRead } from 'wagmi'
import { ContractConfig } from '../web3/contractsettings'

export const useGetCompanyDataId = (address) => {
    console.log('useGetCompanyDataId address es',address)
    const { data } = useContractRead({
        addressOrName: ContractConfig.addressOrName,
        contractInterface:  ContractConfig.contractInterface,
        chainId: ContractConfig.chainId,
        functionName: 'getCompany',
        args:(address ? address.toLowerCase(): address),
        enabled: Boolean(typeof address !== 'undefined' ),
    })
    return data
}