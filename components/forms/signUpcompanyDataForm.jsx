/**
 * SignUpCompanyDataForm
 *    Manage posting essential (name, id and country) company data to contract 
*/

import React, { useState, useContext, useEffect} from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image  from 'next/image'
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";
import  TxInfoPanel  from '../../components/TxInfoPanel'
import {  errorSmartContract  } from '../../utils/constants'
import countries from "i18n-iso-countries";
import { GlobeIcon } from '@heroicons/react/outline'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import { saveCompanyID2DB, getCompanydataDB } from '../../database/dbOperations'
import { InputCountrySel } from '../input-controls/InputCountrySel'
import { useWriteCompanyData } from '../../hooks/useWriteCompanyData'
import { proponContext } from "../../utils/pro-poncontext"
import { parseWeb3Error } from "../../utils/parseWeb3Error";




countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
                    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100"                    

 
 /**
 * SignUpCompanyDataForm is a React functional component that manages posting 
 * essential (name, id and country) company data to contract.
 * @param {object} setCompanyData - Callback function for setting company data in parent component.
 * @param {object} companyData - Object containing current company data from parent component.
 */
const SignUpCompanyDataForm = ({setCompanyData, companyData}) => {   
  // State Variables & constants of module
  const { t, i18n  } = useTranslation(["signup","gralerrors"]);
  const [posted, setPosted] = useState(false) // // begins with false
  const [companyCreated, setcompanyCreated] = useState(false)
  const [lang, setLang] = useState('')
  const [countryList, setCountryList] = useState([]);
  const [block, setBlock] = useState('')  // begins with ''
  const [hash, setHash] = useState('') // begins with ''
  const [link, setLink] = useState('') // begins with ''
  const [isSaving, setIsSaving] = useState(false) //begins with false
  const[taxPayerPlaceHolder,setTaxPayerPlaceHolder]=useState('companyId')
  const { values, handleChange } = useInputForm()
  const [profileCompleted, setProfileCompleted] = useState(
    (companyData && typeof companyData.profileCompleted!=='undefined')
        ? companyData.profileCompleted
        : false
  );
  
    // Get context containing Ethereum address of current user
  const { address } = useContext(proponContext);

  // Load list of countries on current displayed language
  useEffect(() => {
    function changeLanguage() {
      // Get current language code
      const lang = i18n.language;
      // Get list of countries in current language
      const countryGen = countries.getNames(lang);
      // Convert object to array of country names
      const countryArray = Object.values(countryGen);
      // Sort list of countries by current language  
      switch (lang) {
        case "fr":
          countryArray.sort((a, b) => a.localeCompare(b, "fr"));
          break;
        case "es":
          countryArray.sort((a, b) => a.localeCompare(b, "es"));
          break;
        case "en":
        default:
          countryArray.sort((a, b) => a.localeCompare(b, "en"));
          break;
      }
      // Set list of countries in state
      setCountryList(countryArray);
      // Set current language code in state
      setLang(lang)
    }
    // Call function to change language
    changeLanguage();
  }, [i18n.language]);

    // Get Country Name on current displayed language
    // receive Alplha-3 three letter Country Code  
    const getCountryName=(threeLetterCodeCountry) => {
    // Return country name in current displayed language
    return countries.getName(threeLetterCodeCountry, lang)
}

  const onEvent = async (address, companyId, CompanyName) => {
    // save company data to DB record and also to context in case DB write/read fails
    // code moved to onSuccess from here to make sure it won't retain companyId erroneous when is already taken and save record with bad
    // ID, (a weird error, maybe because of developing environment?)
  };
  
  const onSuccess = async (data) => {
    await saveCompanyData(address) 
    // we need to read what we just write to retrieve DB id of record and have it on the context
    const company= await getCompanydataDB(values.companyId.trim()) // read from DB company data
    setCompanyData(company) // write db record to context with id that we'll use to update it
    setcompanyCreated(true)
    setBlock(data.blockNumber)
  }

  const onError = (error) => {
    // default answer, now check if we can specified it
    const customError=parseWeb3Error(t,error)
    errToasterBox(customError)    
    setIsSaving(false)
    return
  }

  const write = useWriteCompanyData({onEvent, onSuccess, setHash, onError, setLink, setPosted})
  const router = useRouter()
 
  const patronobligatorio = new RegExp("^(?!s*$).+");

// Function to display error msg
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
  
  
  // Validate using regexp input fields of company essential data form
  const validate = (pattern, value, msj) => {
      const trimValue = (typeof value !== "undefined" ? value : "").trim();
      if (!pattern.test(trimValue)) {
        errToasterBox(msj);
        return false;
      } else {
        return true;
      }
    };

        
  // handleCacel Drop form and go back to root url
  const handleCancel = () => {
    router.push({pathname: '/'})
  }

  // handleSave -  call Validate fields & if ok send transaction to blockchain
  const handleSave = async () => {
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
    }
    if (!validate(
        patronobligatorio,
        trimmedValues.companyId,
        t("companyform.companyIDerror")
      )) return
    if (!validate(
        patronobligatorio,
        trimmedValues.companyname,
        t("companyform.companynamerror")
      ))return;
      if (!validate(
        patronobligatorio,
        trimmedValues.country,
        t("companyform.countryerror")
      ))return;

  
    // validation passed ok, 
    // create entry on smart contract
    setIsSaving(true)
    

      await write(
         trimmedValues.companyId,
         trimmedValues.companyname, 
         trimmedValues.country,
         "0.0001")
   };

  
  // Save companyId & companyname to App context to appear on App Heading
  const saveCompanyData = async (address) => {
    const companyID = values.companyId.trim()
    const companyName = values.companyname.trim()
    const country = values.country.trim()
    // company has been created at smart contract, now reflect on Mongo DB
    // and save the data we already have. Set profileCompleted DB field to false
    // so user will have to fill that later
    // Dic 2022 added address to save time when inviting companies to RFP and need to recover it
    await  saveCompanyID2DB(companyID, companyName, country, address, errToasterBox)
  }

// render of Component
  return (
   <div id="generalsavearea" className="container mx-auto " >
    {/* Entry Form with buttons save & cancel */}
    <div id="dataentrypanel" className="mt-4  p-4 bg-white  border-orange-200 rounded-md
             container  my-8 mx-4 border-2 border-solid">
      <div className="flex items-center" >
        <Image   alt="DataEntry" src={'/dataentry.svg'} width={22} height={22}></Image>
        <p className="text-gray-600 text-extrabold text-base mt-2 ml-2 font-khula">
          <strong> {t("companyform.recordessentialdata")}</strong>
        </p>
      </div>
      <form
        action=""
        disabled={posted || companyCreated } 
        className="flex flex-col items-center justify-between leading-8 my-6">
        <div className="w-[50%] relative mb-2">
        { typeof companyData.profileCompleted === 'undefined' ?
          // Company not yet registered to blockchain contract
          <React.Fragment>
            <InputCountrySel
              t={t}
              i18n={i18n}
              handleChange={handleChange}
              values={values}
              setPlaceHolder={setTaxPayerPlaceHolder}
              companyData={companyData}
              profileCompleted={profileCompleted}
            />
            <div className="relative mb-4 mt-4">
              <InputCompanyId
                handleChange={handleChange}
                inputclasses={inputclasses}
                values={values}
                placeholder={`${t('companyform.' + taxPayerPlaceHolder )}*`}
                disable={companyCreated}
              />
            </div>
              <div className="relative mb-4">
                <InputCompanyName
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  placeholder={`${t("companyform.companyname")}*`}
                  disable={companyCreated}
                />
            </div>                        
          </React.Fragment>
          :
          <React.Fragment>
            <div className="flex bg-stone-100">
              <GlobeIcon className="h-5 w-5 text-orange-400 mt-1 ml-2 "/>
              <p className="pl-4 ">{getCountryName(companyData.country)}</p>
            </div>                
          <div className="relative mb-4 mt-4">
            <InputCompanyId
              handleChange={handleChange}
              inputclasses={inputclasses}
              values={{companyId:companyData.companyId}}
              placeholder={`${t('companyform.' + taxPayerPlaceHolder )}*`}
              disable={true}
            />
          </div>
          <div className="relative ">
            <InputCompanyName
              handleChange={handleChange}
              inputclasses={inputclasses}
              values={{companyname:companyData.companyname}}
              placeholder={`${t("companyform.companyname")}*`}
              disable={true}
            />
          </div>
          </React.Fragment>
        }
        </div>        
      </form>
      <div id="footersubpanel3">
        <div className={`my-2 py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md ${companyCreated?'hidden':null}`}>
         { typeof companyData.profileCompleted === 'undefined' ?
          <div >
            <div className="flex">
              <div className="mt-2 mr-10 " >
                <button
                  type="button"
                  onClick={handleSave}
                  // isSaving || posted || companyCreated
                  disabled={ posted || companyCreated}
                  className="main-btn"
                >
                  {(!isSaving && !companyCreated) ? `${t("savebutton")}` : ""}
                  {(isSaving || companyCreated) && (
                    <div className=" flex justify-evenly items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900"></div>
                      <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
                    </div>
                  )}
                </button>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={ posted || companyCreated}
                  className="secondary-btn">
                  {t("cancelbutton")}
                </button>
              </div>
            </div>
          </div>
         :
         <div className="flex justify-center">
                    <button 
                        className="main-btn my-4"
                        onClick={()=>router.push({pathname: '/companyprofile'})}>
                        {t('completeprofile')}
                    </button>
         </div>
         }
        </div>
      </div>
    </div>
  
    <div className="mx-auto ml-6">
      {isSaving && 
        <TxInfoPanel 
        itemPosted={posted}
        itemCreated={companyCreated}
        hash={hash}
        link={link}
        block={block}
        handleDataEdition={()=>router.push({pathname: '/companyprofile'})}
        t={t}
        txPosted={posted}
        />
      }
      </div>
   </div>
  );
};
export default SignUpCompanyDataForm;
