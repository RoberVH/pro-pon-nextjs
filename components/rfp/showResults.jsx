import { useState, useEffect } from 'react'
import Image from 'next/image'
import Spinner from '../layouts/Spinner'; 
import { getDBCompaniesbyAddress } from '../../database/dbOperations'

const NullAddress='0x0000000000000000000000000000000000000000'

const ShowResults = ({t,rfpRecord}) => {
  const [winnersData, setWinnersData] = useState()
  const [loading, setLoading] = useState(true)
  
  // hooks
  // first get winners
  useEffect(()=>{
    async function getWinnersData() {
      const uniqueWiners = [...new Set(rfpRecord.winners)] // Set remove duplicates and spread operator convert all into an array
      const winners= await getDBCompaniesbyAddress(uniqueWiners)
      setWinnersData(winners)
      setLoading(false)
    }
    getWinnersData()
  },[rfpRecord.winners])


// Inner Components  ***************************************************************************************************************************
const Title= () => 
<div className="flex">
<Image className="text-orange-400 mt-1 ml-2" alt="Proposal" src="/awards.svg" height={20} width={20} />
    <p className="font-khula ml-4 mt-2 text-md text-stone-900">
        {t('companies_awarded')}
    </p>
</div>

const  TitleDeclare= ({msg}) => 
<div className="m-4">
        <Title />
<div className="mx-auto w-[95%] mt-8  p-4  border-2 border-stone-300 shadow-lg">
    <div className="pl-2 py-1 px-4 mb-8 font-khula text-stone-500">
        <div className="pl-12 mt-8">
            <p className="mt-4">
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
        const companyData= winnersData.filter(winner => winner.address===address)
        return `${companyData[0].companyId} - ${companyData[0].companyname}`
     }
}

const BodyTable = ()=> {
  console.log('rfpRecord.items.length',rfpRecord.items.length)
  if (rfpRecord.items.length > 0)
    return (
      <>
        {rfpRecord.items.map((item,index) => 
          <tr key={index} className="font-khuna text-stone-900 text-bold">
            <td className="px-4 py-2 border border-orange-300">
              {item}
            </td>
            {console.log('index', index,'item:',item)}
            <td className="px-4 py-2 text-left border border-orange-300">
              {console.log('x',processWinner(rfpRecord.winners[index]))}
              <p>{processWinner(rfpRecord.winners[index])}</p>
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
          <p>{processWinner(rfpRecord.winners[0])}</p>
      </td>
    </tr>
    )
  }
 
// 'Main Body'  *********************************************************************************************************************

// if canceled return notice 
 if (rfpRecord.canceled) return ( <TitleDeclare msg={t('rfp_canceled')}/> )

 // if not yet awarded return notice 
 if (rfpRecord.winners.length===0) return (  <TitleDeclare msg={t('waiting_results')} /> )

 // all clear, show results
 if (!loading) return (
  <div className="m-4">
        <Title />
    <div className="mx-auto w-[95%] mt-8  p-4  border-2 border-stone-300 shadow-lg">
      {console.log('winnerfinal',winnersData)}
        <div className="my-4">
        <div className="py-8">
        <table className="mb-4 table-fixed font-khula mx-auto ">
          <thead>
            <tr className="">
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