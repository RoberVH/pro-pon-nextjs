import { useContractWrite  } from 'wagmi'
import { ContractConfig } from '../utils/contractsettings'

export const useWriteRFP = async  (setPosted, setError) => {
    const { write, error } = useContractWrite({
        addressOrName: ContractConfig.addressOrName,
        contractInterface:  ContractConfig.contractInterface,
        chainId: ContractConfig.chainId,
        functionName: 'createRFP',
        onSuccess(data){ setPosted(data) },
        onerror(error) { setError(error) }
    })
    return write
}