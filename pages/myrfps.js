/**
 * MyRFPs
 *      Page to display RFPs belonging to current company, 
 *      It should read them from Contract, not DB
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, useCallback, useContext, Fragment } from "react";
// import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getRFPsbyCompanyAddress } from '../web3/getRFPsbyCompanyAddress'
import RfpCards from "../components/layouts/RfpCards";
import { proponContext } from "../utils/pro-poncontext"
import Spinner from "../components/layouts/Spinner"
import { Warning } from '../components/layouts/warning'
import { errorSmartContract } from "../utils/constants";

function MyRFPs() {
  const [loading, setloading] = useState(true)
  const [RFPs, setRFPs] = useState([])
  const [noRFP, setNoRFP] = useState(false)
  const [searching, setSearching] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  

  const { companyData, address } = useContext(proponContext);
  const { t } = useTranslation("rfps");

 useEffect(()=>{
  async  function getCompanyRFPs()  {
    if (address) {
      const result = await getRFPsbyCompanyAddress(address)
      if (result.status) setRFPs(result.RFPs)
      else if (result.msg) errorSmartContract(result.msg)
    }
    setSearching(false)
  }
  getCompanyRFPs()
 },[address])



 // ****************************** Inner components
// const Warning = ({title}) => <div className="text-red-600 mt-4 w-2/3 min-w-full h-[9rem] min-h-full border-2 border-coal-500 
// flex shadow-lg p-4 justify-center items-center tracking-wide uppercase font-khula text-xl font-bold"> 
//   {title}  
// </div>


 if (!address) return ( <Warning title = {t("notconnected", { ns: "common" })} />)
 if (searching) return (<div className="mt-4 border-orange-500 p-8"><Spinner /></div>)
 if (!companyData?.companyname) return ( <Warning title = {t("nocompany", { ns: "common" })} />)
 if (Boolean(RFPs?.length)) {
  return (
    <div className="p-2">
      <RfpCards rfps={RFPs} setIsWaiting={setIsWaiting} companyData={companyData} t={t}/>
    </div>
    )
 }  else {
    console.log('No hay', RFPs?.length, RFPs, Boolean(RFPs?.length) )
    return (<Warning title = {t("noresults", { ns: "common" })} />)}
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "rfps",
        "common",
        "gralerrors",
        "menus",
        "companies",
      ])),
    },
  };
}

export default MyRFPs;