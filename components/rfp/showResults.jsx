import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getContractWinners } from '../../web3/getContractWinners'
import { getContractWinnersFromServer } from '../../web3/getContractWinnersFromServer'

import { getContractRFP } from '../../web3/getContractRFP'
import Spinner from '../layouts/Spinner'; 
import { getDBCompaniesbyAddress } from '../../database/dbOperations'
import { parseWeb3Error } from '../../utils/parseWeb3Error'
const { BigNumber } = require("ethers");
import { getContractRFPFromServer } from "../../web3/getContractRFPFromServer";
import { ethers } from 'ethers'

// toastify related imports
import { toastStyle } from "../../styles/toastStyle"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NullAddress=ethers.constants.AddressZero


const ShowResults = ({t,rfpIndex}) => {
  const [rfpRecord, setRFPRecord] = useState({})
  const [winnersAddress, setWinnerAddress] = useState()  // Holds the list of winers addresses (even deserted) awarded
  const [winnersData, setWinnersData] = useState()
  const [loading, setLoading] = useState(true)
  
  
  // hooks
  // first get winners
  useEffect(()=>{
    async function getWinnersData() {
      // first check if is canceled
      try {
    let result;
    if (window.ethereum ) 
      result = await getContractRFP(rfpIndex)
      else 
      result = await getContractRFPFromServer(rfpIndex)
      if (!result.status) {
        const customError = parseWeb3Error(t, result);
        errToasterBox(customError);
        setNoRFP(true);
        return;
      }
      const RFP = { };
      //  remove redundant numeric properties ([0]: ... [N]) from contract response & convert from Big number to
      //  number at the same time
      for (const prop in result.RFP) {
        if (isNaN(parseInt(prop))) {
          if (result.RFP[prop] instanceof BigNumber)
            RFP[prop] = result.RFP[prop].toNumber();
          else RFP[prop] = result.RFP[prop];
        }
      }
      setRFPRecord(RFP)
      //const winnersFromContract = await getContractWinners(rfpIndex)
      let winnersFromContract;
      if (window.ethereum ) 
          winnersFromContract = await getContractWinners(rfpIndex)
        else {
           const result= await getContractWinnersFromServer(rfpIndex)
           if (result.status) 
              winnersFromContract = result
            else  
            throw new Error(result.error)
          }
      if (winnersFromContract.status) {
        // Set remove duplicates and spread operator convert all into an array
        const uniqueWiners = [...new Set(winnersFromContract.Winners)] 
        const winners= await getDBCompaniesbyAddress(uniqueWiners)
        // get rid of possible empty objects in array due to 'deserted' winners found
        const newWinners = winners.filter(elem => elem.hasOwnProperty('address'));
        setWinnerAddress(winnersFromContract.Winners)
        setWinnersData(newWinners)
        setLoading(false)
      }
      } catch (error) {
        const customError = parseWeb3Error(t, error);
        errToasterBox(customError)
      }
  }
    getWinnersData()
  },[])


// Utility functions ***************************************************
const errToasterBox = (msj) => {
  toast.error(msj, {
    //toastId: id,
    ...toastStyle,
  });
};


// Inner Components  ***************************************************************************************************************************
const Title= () => 
<div className="flex">
<Image className="text-orange-400 mt-1 ml-2" alt="Proposal" src="/awards.svg" height={20} width={20} />
    <p className="lg:text-xs xl:text-base font-khula ml-4 mt-2 text-md  text-stone-900">
        {t('companies_awarded')}
    </p>
</div>

const  TitleDeclare= ({msg, redflag}) => 
<div className="m-4">
        <Title />
<div className="mx-auto w-[95%] mt-8  p-4  border-2 border-stone-300 shadow-lg">
    <div className="pl-2 py-1 px-4 mb-8 font-khula text-stone-500">
        <div className="pl-12 mt-8">
            <p className={`lg:text-xs xl:text-base font-khula ml-4 mt-2 text-lg  ${redflag ? 'text-red-600': 'text-stone-900'}`}>
                <strong>{msg}</strong>
            </p>
        </div>
    </div>
</div>
</div>

const processWinner = (address) => {
  if (address===NullAddress)
    return t('deserted_items')
  else {
        const companyData= winnersData.filter(winner => winner.address.toLowerCase()===address.toLowerCase())
        if (companyData)
            return `${companyData[0].companyId} - ${companyData[0].companyname}`
          else
          return `${t('cannot_retrieve_company')} - ${address}`
     }
}

const BodyTable = ()=> {
  if (rfpRecord.items.length > 0)
    return (
      <>
        {rfpRecord.items.map((item,index) => 
          <tr key={index} className="lg:text-xs xl:text-base font-khuna text-stone-900 text-bold">
            <td className="px-4 py-2 border border-orange-300">
              {item}
            </td>
            <td className="px-4 py-2 text-left border border-orange-300">
              <p>{processWinner(winnersAddress[index])}</p>
            </td>
          </tr>
        )
        }
      </>
      ) 
      else return (
      <tr key='uniqueWinner' className="">
        <td className="px-4 py-2 border border-orange-300">
          {`${rfpRecord.name} - ${rfpRecord.description}`}
        </td>
        <td className="px-4 py-2 text-left border border-orange-300">
          <p>{processWinner(winnersAddress[0])}</p>
      </td>
    </tr>
    )
  }
 
// 'Main Body'  *********************************************************************************************************************

// if canceled return notice 
 if (rfpRecord.canceled) return ( <TitleDeclare msg={t('cancel_notice')} redflag={true}/> )

 // if not yet awarded return notice 
 if (winnersAddress?.length===0) return (  <TitleDeclare msg={t('waiting_results')} /> )

 // all clear, show results
 if (!loading) return (
  <div className="m-4">
        <Title />
    <div className="mx-auto w-[95%] mt-8  p-4  border-2 border-stone-300 shadow-lg">
        <div className="my-4">
        <div className="py-8">
        <table className="mb-4 table-fixed font-khula mx-auto ">
          <thead>
            <tr className="lg:text-xs xl:text-base">
                <th className="w-3/5 px-2 py-2 border border-orange-300 ">{t('item')}</th>
                <th className="w-2/5 px-4 py-2 border border-orange-300">{t('winner')}</th>
            </tr>
            </thead>
          <tbody className="">
              <BodyTable />
          </tbody>
      </table>
        </div>
        </div>
   </div>
  </div>
    );
// as long as we haven't finnish loading a Spinner is shown in case the other conditions weren't met
  return (
    <div className="mt-24"> 
      <Spinner />
    </div>)
};
export default ShowResults;