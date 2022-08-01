import React, { useState, useContext } from "react";
import { useAccount, useContractRead, useDisconnect } from 'wagmi'
import { contractAddress } from '../utils/proponcontractAddress'
import proponJSONContract from '../utils/pro_pon.json'
import { proponContext } from '../utils/pro-poncontext'
import { proponChainId  } from '../utils/constants'
import  useGetCompanyDatafromDB  from './useGetCompanyDatafromDB'


const useGetCompanyData = async () => {
    const { setcurrentCompanyData, companyId, companyName } =  useContext(proponContext);
    const { address }  = useAccount()  

    const NULL_ADDRESS='0x0000000000000000000000000000000000000000'

    const getCompanydataDB = useGetCompanyDatafromDB;

    const { data, isError, isLoading } = await useContractRead({
    addressOrName: contractAddress,
    contractInterface:  proponJSONContract.abi,
    chainId: proponChainId,
    functionName: 'getCompany',
    args:[address ? address:NULL_ADDRESS],
    async onSuccess(data) {
        //setLocalCompanyId(data.id)
        console.log('En OnSuccess de useGetCompanyData, data.id es', data.id)
        let result={}
        if (data.id)  result= await getCompanydataDB(data.id)
        console.log('result',result)
        setcurrentCompanyData(data.name, data.id, result)


      },
      onError(error) {
        console.log('Error usecontractread', error)
      }
    })


  };
  export default useGetCompanyData;