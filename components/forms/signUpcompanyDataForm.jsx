/**
 * SignUpCompanyDataForm
 *    Present stepper step 2 to register essential data to smart contract form
 *    3 manage posting company data to contrat and advance stepper phase to 3
 *    if this address has already a CompanyID registered in the blockchain go to step 3
 *    to record/modify company data
*/
import React, { useState, useContext, useEffect} from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";
import  TxInfoPanel  from '../../components/TxInfoPanel'
//import { ethers } from 'ethers'
import {  errorSmartContract  } from '../../utils/constants'
import countries from "i18n-iso-countries";
import { GlobeIcon } from '@heroicons/react/outline'
//import { proponContext } from '../../utils/pro-poncontext'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import { saveCompanyID2DB, getCompanydataDB } from '../../database/dbOperations'
import { InputCountrySel } from '../input-controls/InputCountrySel'
import { useWriteCompanyData } from '../../hooks/useWriteCompanyData'


countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
                    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100"                    

const SignUpCompanyDataForm = ({setCompanyData, companyData}) => {   //{setPhase}
  // State Variables & constants of module
  const { t, i18n  } = useTranslation("signup");
  const [posted, setPosted] = useState(false) //false  
  const [companyCreated, setcompanyCreated] = useState(false)
  const [lang, setLang] = useState('')
  const [countryList, setCountryList] = useState([]);
  const [block, setBlock] = useState('')
  const [hash, setHash] = useState('') 
  const [link, setLink] = useState('')
  const [isSaving, setIsSaving] = useState(false) //false
  const[taxPayerPlaceHolder,setTaxPayerPlaceHolder]=useState('companyId')
  const { values, handleChange } = useInputForm()
  //const { setCompanyData, companyData } = useContext(proponContext);
  const [profileCompleted, setProfileCompleted] = useState(
    (companyData && typeof companyData.profileCompleted!=='undefined')
        ? companyData.profileCompleted
        : false
  );

  useEffect(() => {
    function changeLanguage() {
      const lang = i18n.language;
      const countryGen = countries.getNames(lang);
      const countryArray = Object.values(countryGen);
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
      setCountryList(countryArray);
      setLang(lang)
    }
    changeLanguage();
  }, [i18n.language]);

    // Get Country Name on current displayed language
  // receive Alplha-3 three letter Country Code  and get name
  const getCountryName=(threeLetterCodeCountry) => {
    return countries.getName(threeLetterCodeCountry, lang)
}

  const onEvent = async (address, companyId, CompanyName) => {
    // save company data to DB record and also to context in case DB write/read fails
    await saveCompanyData() 
    const company= await getCompanydataDB(values.companyId.trim()) // read from DB company data
    setCompanyData(company) // write db record to context
    setcompanyCreated(true)
  };

  const onSuccess = (data) => {
    setBlock(data.blockNumber)
  }

  const onError = (error) => {
    console.log(error)
    let customError=t('errors.undetermined_blockchain_error')  // default answer, now check if we can specified it
    if (typeof error.reason!== 'undefined') {
      if (error.reason==='insufficient funds for intrinsic transaction cost')
          customError=t('errors.insufficient_funds')
      if (error.reason==='user rejected transaction')
          customError=t('errors.user_rejection')
          // read errors coming from Contract require statements
      if (errorSmartContract.includes(error.reason)) customError=t(`error.${error.reason}`)
    } else {
        if (error.data && error.data.message) customError=error.data.message
        else if (typeof error.message!== 'undefined') customError=error.message
   }
    errToasterBox(customError)    
    setIsSaving(false)
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

        
  // handleCacel Drop form and go back to root address
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

  
  // Save companyId & companyname to App context
  const saveCompanyData = async () => {
    const companyID = values.companyId.trim()
    const companyName = values.companyname.trim()
    const country = values.country.trim()
    setCompanyData({companyId:companyID, companyname: companyName, country:country, profileCompleted:false})
    // company has been created at smart contract, now reflect on Mongo DB
    // and save the data we already have. Set profileCompleted DB field to false
    // so user will have to fill that later    
    await  saveCompanyID2DB(companyID, companyName, country)
  }

// render of Component
  return (
   <div id="generalsavearea" className="container mx-auto " >
    {/* Entry Form with buttons save & cancel */}
    <div id="dataentrypanel" className="mt-4  p-4 bg-white  border-orange-200 rounded-md
                  container  my-8 mx-4 border-2 border-solid">
      <p className="text-gray-600 text-extrabold text-base text-xl mb-4 font-khula">
        ⌨ <strong> {t("companyform.recordessentialdata")}</strong>
      </p>
      <form
        action=""
        disabled={posted || companyCreated } 
        className="flex flex-col items-center justify-between leading-8 my-10">
        <div className="w-[50%] relative mb-4">
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
        <div className={`my-4 py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md ${companyCreated?'hidden':null}`}>
         { typeof companyData.profileCompleted === 'undefined' ?
          <React.Fragment>
              <div className="mt-4 mr-10 " >
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
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={ posted || companyCreated}
                  className="secondary-btn">
                  {t("cancelbutton")}
                </button>
              </div>
          </React.Fragment>
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
