import { useState, useEffect, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { proponContext } from '../utils/pro-poncontext'
import NoConnectedWarning from "../components/layouts/NoConnectedWarning"
import  RFPDataForm  from '../components/forms/rfpDataForm'
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Createrfps() {
  const { companyData, address } = useContext(proponContext)

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
 
  const { t } = useTranslation(["rfps", "common"]);

  // If not Logged In display warning sign
  if (!address) 
    return (
      <div id="signup-screen" className="h-screen flex flex-col items-center">
        <NoConnectedWarning msj= {t('notconnected',{ns:"common"})} />
      </div>      
    )  
  if (typeof companyData.companyId==='undefined') 
    return (
      <div id="signup-screen" className="h-screen flex flex-col items-center">
        <NoConnectedWarning msj= {t('onlyregisteredtoRFP',{ns:"rfps"})} />
      </div>
    )
  // all Ok, allow create RFP screen
  return (
    // Logged In, display create RFP screen
    <div id="createrfps" className="md:mt-4 sm:mt-4">
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
        "gralerrors"
      ])),
    },
  };
}

export default Createrfps;
