import { ContractConfig } from "../utils/contractsettings" 
import { useContractRead } from "wagmi"

const  useReadProponContract= (functionName, args) =>  {
  const readContract = useContractRead( {
    ContractConfig,
    functionName,
    args
})
return readContract
}

export default useReadProponContract