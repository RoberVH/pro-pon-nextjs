import { useState, useEffect, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { proponContext } from '../utils/pro-poncontext'
import  RFPDataForm  from '../components/forms/rfpDataForm'

import { useRouter } from "next/router";
import  { useAccount }  from 'wagmi'
import { SearchIcon } from "@heroicons/react/outline";
import DisplayResults from "../components/DisplayResults";
import SearchDB from "../components/SearchDB";
import { companyParams, companyActions } from "../utils/companyItems";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Createrfps() {
  const { companyData } = useContext(proponContext)
  const { locale,pathname, query, asPath   } = useRouter();
  const [ IsWaiting, setIsWaiting] = useState(false)
  const [ error, setError] = useState(false)
  const { isConnected } = useAccount()

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };


  const router = useRouter()
  
  const { t } = useTranslation(["rfps", "common"]);

  useEffect(()=>{
    if (typeof companyData.companyId==='undefined')  
      errToasterBox(t('notconnected',{ns:"common"}))
  },[companyData,t])

  // If not Logged In display warning sign
  if (typeof companyData.companyId==='undefined') { 
      return (
        <div className="text-center  mt-12 text-2xl text-red-600 ">
          <h1 className="mx-auto w-[45%] bg-yellow-200 py-4 rounded-2xl">
          👆 {t('onlyregisteredtoRFP',{ns:"rfps"})}
          </h1>
        </div>
    )
  }  else if (!isConnected) {
    return (
      <div className="text-center  mt-12 text-2xl text-red-600 ">
        <h1 className="mx-auto w-[45%] bg-yellow-200 py-4 rounded-2xl">
        👆 {t('notconnected',{ns:"common"})}
        </h1>
      </div>
    )
  }  else return (
    // Logged In, display create RFP screen
    <div id="createrfps" className="md:mt-8 sm:mt-4">
      <RFPDataForm  />
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "menus",
        "rfps",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default Createrfps;
