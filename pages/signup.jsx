import React, { useState, useEffect, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { proponContext } from '../utils/pro-poncontext'
import NoConnectedWarning from './../components/layouts/NoConnectedWarning';
import SignUpcompanyDataForm from "../components/forms/signUpcompanyDataForm";


/**
 * Signup - Page that allows to connect and Sign Up a Company
 *          It consist of two steps, the steps are tracked by state var phase
 *          Phase:
 *               1 - Connecting wallet
 *               2 - Registering essential Company Data on Polygon contract
 *               3 - Registering | modify extended Company Data on Backend DB - 
 */
function Signup() {
  const [isWaiting, setIsWaiting] = useState(false)
  const { locale } = useRouter();
  const { t } = useTranslation("signup");
  
  const {  companyData, setCompanyData, address } = useContext(proponContext);
  const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object  


  if (!address) return (
      <div id="signup-screen" className="h-screen flex flex-col items-center">
         <NoConnectedWarning  msj={t('explanation1', {ns: 'common'})}/>
      </div>
  )
         return (
          <div id="signup-screen" className="h-screen flex flex-col items-center ">
            <div id="activities-of-signup"   className="h-[80%] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/3 ">
              <div id ="signupcompanydatadadhost" className="flex justify-center">
                  <SignUpcompanyDataForm setCompanyData={setCompanyData} companyData={companyData}  />
              </div>
          </div>
    </div>
  );
  return(null)
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["signup", "menus", "common","rfps","gralerrors"])),
    },
  };
}

export default Signup;
