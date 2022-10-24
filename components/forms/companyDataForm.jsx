/**
 * CompanyDataForm
 *    Present stepper step 3 to register rest of company data to DB form
 *    This form can only acept data if and only if the context has already the company ID &
 *    company name. This value could have been set in the immidiate step 2 prior to this or if
 *    Tx took too much time, later, when user navigate to this screen and have read the data
 *    from the blockchain for this address
 *
 */
import { useState, useContext, useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GlobeIcon } from '@heroicons/react/outline'
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";
import {  errorSmartContract  } from '../../utils/constants'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { verifyData_Save } from '../../database/dbOperations'

import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";

import { InputWebsite } from "../input-controls/InputWebsite";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import { InputEmail } from "../input-controls/InputEmail";
import { InputAdminName } from "../input-controls/InputAdminName";

import { useSignMessage } from '../../hooks/useSignMessage'
import { Router } from "next/router";

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);



const CompanyDataForm = ({companyData, setCompanyData, address}) => {
  const { t, i18n } = useTranslation(['signup', 'common'])
  const [saving, setSaving] = useState(false)
  const [showSignMsg, setShowSignMsg] = useState(false)
  const [countryList, setCountryList] = useState([])
  //const { setCompanyData, companyData } = useContext(proponContext)
  const { values, handleChange } = useInputForm(companyData)
  const [message, setMsgtoSign] = useState()
  const [lang, setLang] = useState('')
 
  const router = useRouter()
  const [profileCompleted, setProfileCompleted] = useState(
    (companyData && typeof companyData.profileCompleted!=='undefined')
        ? companyData.profileCompleted
        : false
  );

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const onSuccess= async  (message, signature) => {
  // Verify signature when sign message succeeds
  //const address = verifyMessage(message, signature)
  const result = await verifyData_Save(message,signature)
  if (result.status ) {
    toast.success(t('companydataadded',toastStyleSuccess))
    setCompanyData(JSON.parse(message))
  } else
  errToasterBox(result.message);
  setSaving(false)
};

  const  onError =  async (error) => {
    console.log('onerror error.reason',error.reason )
    console.log('onerror error.message',error.message )
    let customError=t('errors.undetermined_blockchain_error')  // default answer, now check if we can specified it
    if (typeof error.reason!== 'undefined') {
      console.log('checking error.reason',  error.reason.includes('rejected'))
      if (error.reason==='insufficient funds for intrinsic transaction cost')
          customError=t('errors.insufficient_funds')
      if (error.reason==='user rejected signing')
          customError=t('errors.user_rejection')
          // read errors coming from Contract require statements
      if (errorSmartContract.includes(error.reason)) customError=t(`error.${error.reason}`)
    } else {
        if (error.data && error.data.message) customError=error.data.message
        else if (typeof error.message!== 'undefined') customError=error.message
   }
   console.log('customError',customError)
    errToasterBox(customError)    
    setSaving(false)
  };

  //const recoveredAddress = useRef()
  const  signMessage = useSignMessage({onSuccess, onError})

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


  const proceedToSign = async () => {
    setShowSignMsg(false)
    await signMessage(message)
  }

  // Validate and Save data to DB
  const handleSave = async () => {
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      if (key !== "profileCompleted")
        trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
      else trimmedValues[key] = value;
    }
    if (!validate(
        patronobligatorio,
        trimmedValues.adminname,
        t("companyform.nameerror")
      )) return;
    if (!validate(patronemail, trimmedValues.email, t("companyform.emailerror"))) return;
    if (trimmedValues.website && !validate(
          patronwebsite,
          trimmedValues.website,
          t("companyform.websiteerror"))) return;
   
    // Display modal to show & ask to sign message
    const message = JSON.stringify(trimmedValues )
    setMsgtoSign(message)
    setSaving(true);
    setShowSignMsg(true)
  };

  const inputclasses ="require leading-normal flex-1 border-0  border-grey-light " &&
    "rounded rounded-l-none outline-none pl-10 w-full bg-stone-100 focus:bg-blue-100 font-khula font-extrabold";

  const patronemail = new RegExp(
    "^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );
  const patronobligatorio = new RegExp("^(?!s*$).+");
  //const patronwebsite= new RegExp("/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/")
  const patronwebsite = new RegExp(
    "^(?:(?:https?|ftp):\\/\\/)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:\\/\\S*)?$"
  );
  const validate = (pattern, value, msj) => {
    const trimValue = (typeof value !== "undefined" ? value : "").trim();
    if (!pattern.test(trimValue)) {
      errToasterBox(msj);
      return false;
    } else {
      return true;
    }
  };


  return (
    <div className="container mx-auto ">
      <div className={`${showSignMsg ? 'fixed bg-zinc-100 inset-0 opacity-80 z-50':null}`} >
        <div className={`fixed bottom-0 right-0 -mt-32 text-center bg-white h-[25%] w-[40%] border border-2 border-orange-600  
                        ${showSignMsg ? 'translate-y-0': 'translate-y-full'} ease-in-out duration-1000`} >
          <div className="pt-4 pl-4 text-left">
            <p className="py-8 px-10 font-khula text-xl text-black font-bold">{t('showsigningmsg')}</p>
            <div className="flex justify-center" >
              <button onClick={proceedToSign} className="flex main-btn"> {t('signmessage',{ns:"common"})}</button>
            </div>
          </div>
        </div>
      </div>

      <div id="dataentrypanel" className="mt-4  p-4 bg-white  border-orange-200 rounded-md
                  container  my-8 mx-4 border-2 border-solid">
      <p className="text-gray-600 text-extrabold text-xl mb-10 font-khula">
        {t("companyform.recordcompanytitle")}
      </p>
      <form
        action=""
        className={`flex flex-col items-center justify-between leading-8 mb-8`}      >
        <div className="w-[80%] relative mb-4 flex bg-stone-100">
          <GlobeIcon className="h-5 w-5 text-orange-400 mt-1 ml-2"/>
          <p className="pl-4">{getCountryName(companyData.country)}</p>
        </div>  
        <div className="w-[80%] relative mb-4">
          <InputCompanyId
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyId")}*`}
            disable={true}
          />
        </div>
        <div className=" w-[80%] relative mb-4">
          <InputCompanyName
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyname")}*`}
            disable={true}
          />
        </div>
      
        <div className="w-[80%] relative mb-4">
          <InputAdminName
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.adminname")}*`}
          />
        </div>

        <div className="w-[80%] relative mb-4">
          <InputEmail
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.emailcompany")}*`}
          />
        </div>

        <div className="w-[80%] relative mb-4 ">
          <InputWebsite
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.website")}`}
          />
        </div>
      </form>
      <div id="footersubpanel3">
        <div className="py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md">
          <div className=" mt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`bg-orange-400 font-xl font-bold font-khula  mr-10 px-4 py-2.5  
                    text-white leading-tight uppercase rounded shadow-md hover:bg-orange-700 active:hover:shadow-lg 
                    active:focus:bg-orange-700 focus:shadow-lg active:focus:outline-none active:focus:ring-0 active:bg-orange-800 
                    active:shadow-lg transition duration-150 ease-in-out disabled:bg-orange-400
                    ${saving ? "cursor-not-allowed" :""}`}
            >
              {!saving ? `${t("savebutton")}` : ""}
              {saving && (
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
              disabled={saving}
              onClick={ ()=> router.push({pathname:'/'}) }
              className={`bg-stone-400 font-xl font-bold font-khula   px-4 py-2.5  
                    text-white leading-tight uppercase rounded shadow-md focus:outline-none  
                    active:shadow-lg transition duration-150 ease-in-out
                    ${saving ? "cursor-not-allowed bg-stone-400" : "hover:bg-stone-700 hover:shadow-lg focus:ring-0 active:bg-stone-800 focus:bg-stone-700 focus:shadow-lg"}`}>
              {t("cancelbutton")}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default CompanyDataForm;
