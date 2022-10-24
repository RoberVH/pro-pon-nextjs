import { useContext } from 'react'
import CompanyDataForm from '../components/forms/companyDataForm'
import NoConnectedWarning from '../components/layouts/NoConnectedWarning'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next";
import { proponContext } from '../utils/pro-poncontext'
import { useRouter } from "next/router";


function Companyprofile() {
  const {  companyData, setCompanyData, address } = useContext(proponContext);
  const { t } = useTranslation("signup");
  const router = useRouter()

  const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object  
  
  if (!address) return (
    <div id="signup-screen" className="h-screen flex flex-col items-center">
       <NoConnectedWarning  msj={t('explanation1', {ns: 'common'})}/>
    </div>
  )

  console.log('prof', companyData)
  if (isEmpty(companyData)) router.push({pathname: '/'})
  
  return (
   <div id="signup-screen" className="h-screen flex flex-col items-center">
    {!address ? <NoConnectedWarning   msj={t('explanation1', {ns: 'common'})} />
      :
      <div id="activities-of-signup" 
        className="container my-8 mx-4">
        <div id='stepScreen' className="container mx-auto mt-4   ">
          <CompanyDataForm companyData={companyData} setCompanyData={setCompanyData} address={address}  />
        </div>
      </div>}
  </div>
);
}

// Get language translation json files  and the rfpId params at url to present it on this page
export async function getServerSideProps({ locale, query }) {
  return {
    props: {
      query: query,
      ...(await serverSideTranslations(locale, ["signup", "menus", "common"])),
      // Will be passed to the page component as props
    },
  };
}

export default Companyprofile;