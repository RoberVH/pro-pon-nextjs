import { useContractRead } from 'wagmi'
import { ContractConfig } from '../web3/contractsettings'

export const useGetCompanyDataId = (address) => {
    const { data } = useContractRead({
        addressOrName: ContractConfig.addressOrName,
        contractInterface:  ContractConfig.contractInterface,
        chainId: ContractConfig.chainId,
        functionName: 'getCompany',
        args:(address ? address: address),
        enabled: Boolean(typeof address !== 'undefined' ),
    })
    return data
}