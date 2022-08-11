import { useState, useEffect, useCallback } from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";
import { getRFPbyId } from '../../database/serverDBUtils'
import { convDate } from '../../utils/misc'
import Spinner from '../../components/layouts/Spinner'

const TableEntry = (title, value) => {
  <tr>
    <td><strong>{title}:</strong></td>
    <td className="text-orange-600">{value}</td>
  </tr>
}

function HomeRFP({rfpRecord}) {
  //const {  locale } = useRouter();
  const router = useRouter()
  const { t } = useTranslation();
    
  
  const query = router.query
  console.log('rfpRecord',rfpRecord)
  // console.log('parms',parms)
  
  // useEffect(()=>{
  //   const getRFP = () => {
  //       }
  //   getRFP()
  // },[query])
  
   if (  rfpRecord.name==='') return (<div>Sin RFP</div>)
  return (
    <div className="flex justify-center">
      <div className="w-1/4 font-khula mt-8 mx-8  p-8 bg-white border-2 border-orange-300 
        leading-8 ">
        <table className="table-auto">
          <tbody>
            {TableEntry('Company Id', rfpRecord.companyId)}
            {TableEntry('companyname',rfpRecord.companyname)}
            {TableEntry('rfp_Name',rfpRecord.name)}
            {TableEntry('openDate',convDate(rfpRecord.openDate))}
            {TableEntry('enddate',convDate(rfpRecord.endDate))}
            {TableEntry('decisiondate',convDate(rfpRecord.endReceivingDate))}
          </tbody>
        </table>
        </div>
    </div>
  )
}
// This page will be a dynamic SSG that retrieves the RPF called in url slug [rfpid]
// it won't generate any path but we need to include it to tell Nextjs that fallback is 'blocking'
 export async function getStaticPaths(context) {
    return { paths: [],  fallback: 'blocking' }
 }

// Get language translation json files  and the rfpId slug to present it on this page
 export async function getStaticProps({locale, params}) {
  console.log('context', params.rfpid,locale)
  const rfpId=params.rfpid
  let rfpRecord = await getRFPbyId(rfpId)
  console.log('En page obtuve', rfpRecord)
  if (!rfpRecord)  rfpRecord = {}
 
  return {
    props: { 
      rfpRecord,...(await serverSideTranslations(locale, ['rfps', 'common', 'menus'])),
      // Will be passed to the page component as props
    },
  }}
  
export default HomeRFP