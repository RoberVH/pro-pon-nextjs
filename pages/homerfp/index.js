import { useState, useEffect, useCallback } from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";
import  RFPessentialData  from '../../components/rfp/RFPessentialData'
import  UploadRFP  from '../../components/rfp/uploadRFP'

import { convDate } from '../../utils/misc'
import Spinner from '../../components/layouts/Spinner'




function HomeRFP() {  //{rfpRecord}
  //const {  locale } = useRouter();
  const [rfpRecord, setRfpRecord] = useState()
  const router = useRouter()
  const { t } = useTranslation("rfps");
    
  const query = router.query
  
  useEffect(()=>{
    const getRFP = () => {
      setRfpRecord(query) 
      console.log('setting query',query)
    }
    getRFP()
  },[query])

  const handleDeclareWinner = () => {
    console.log('handleDeclareWinner')
  }
  
   if (  !rfpRecord) return (<div>Sin RFP</div>)
  return (
    <div>
      <div className="mt-4 my-2 mx-8 outline outline-1 outline-orange-200 flex justify-center bg-white shadow-md">
      <label className="p-2 ">{t('rfpform.name')}: &nbsp; </label>
      <label className="pt-2 text-orange-500">{rfpRecord.name}</label>
      </div>
        <div className="mt-4">
          {RFPessentialData(t, rfpRecord, handleDeclareWinner)}
        </div>
        <div className="mt-4">
          <UploadRFP t={t}/>
        </div>
    </div>
  )
}

// Get language translation json files  and the rfpId slug to present it on this page
 export async function getStaticProps({locale}) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['rfps', 'common', 'menus'])),
      // Will be passed to the page component as props
    },
  }}
  
export default HomeRFP