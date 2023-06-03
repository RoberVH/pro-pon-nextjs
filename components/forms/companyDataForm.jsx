/**
 * CompanyDataForm - Edit Profile Form
 *    When user clicks on Profile Menu at Account display, is presented with this  form to register rest of company data 
 *    to DB form (adminname, email and website). 
 *    This form can only acept data if and only if the context has already the company ID &
 *    company name. This value could have been set in the immidiate step 2 prior to this or if
 *    Tx took too much time, later, when user navigate to this screen and have read the data
 *    from the blockchain for this address
 *    Notice: As companyData in context has data for other components that won't be updated
 *            in the form, there is not need to pass them onto update (PATCH call to server) DB
 *            method at handleSave, so we  filter those out before updating, namely rfpWon,
 *            rfpSent and companyRFPs array
*
*/
import { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { GlobeIcon } from "@heroicons/react/outline"
import Image from 'next/image'
import countries from "i18n-iso-countries"
import english from "i18n-iso-countries/langs/en.json"
import spanish from "i18n-iso-countries/langs/es.json"
import french from "i18n-iso-countries/langs/fr.json"
import { SignMsgAlert } from "./../layouts/SignMsgAlert"
import { errorSmartContract } from "../../utils/constants"
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle"
import { verifyData_Save } from "../../database/dbOperations"

import { toast } from "react-toastify"
import useInputForm from "../../hooks/useInputForm"
import "react-toastify/dist/ReactToastify.css"

import { InputWebsite } from "../input-controls/InputWebsite"
import { InputCompanyId } from "../input-controls/InputCompanyId"
import { InputCompanyName } from "../input-controls/InputCompanyName"
import { InputEmail } from "../input-controls/InputEmail"
import { InputAdminName } from "../input-controls/InputAdminName"

import { useSignMessage } from "../../hooks/useSignMessage"

countries.registerLocale(english)
countries.registerLocale(spanish)
countries.registerLocale(french)

const CompanyDataForm = ({ companyData, setCompanyData }) => {
  const { t, i18n } = useTranslation(["signup", "common"]);
  const [saving, setSaving] = useState(false);
  const [showSignMsg, setShowSignMsg] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const { values, handleChange } = useInputForm(companyData);
  const [message, setMsgtoSign] = useState();
  const [lang, setLang] = useState("");
  const [downloadFolderOption, setsDownloadFolderOption] = useState(
    companyData && typeof companyData.downloadFolderOption !== "undefined"
    ? companyData.downloadFolderOption : '');

  const router = useRouter();
  const [profileCompleted, setProfileCompleted] = useState(
      companyData && typeof companyData.profileCompleted !== "undefined"
        ? companyData.profileCompleted
        : false
    );
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
  const onSuccess = async (message, signature) => {
    // When sign message succeeds, send to server for checking and to update DB with email/adminname/website
    const result = await verifyData_Save(message, signature);
    if (result.status) {
      toast.success(t("companydataadded", toastStyleSuccess));
      // Update Context with all data of updated company:
      // everything ok, we need to refresh companyData and from DataBase set it again, but we need to recover values of contract :
      const newCompanyProps=JSON.parse(message)
      const updatedCompanyData = { ...companyData, ...newCompanyProps, profileCompleted:true };
      setCompanyData(updatedCompanyData);
    } else errToasterBox(result.message);
    setSaving(false);
  };

  const onError = async (error) => {
    let customError = t("errors.undetermined_blockchain_error"); // default answer, now check if we can specified it
    if (typeof error.reason !== "undefined") {
      if (error.reason === "insufficient funds for intrinsic transaction cost")
        customError = t("errors.insufficient_funds");
      if (error.reason === "user rejected signing")
        customError = t("errors.user_rejection");
      if (errorSmartContract.includes(error.reason))
        customError = t(`error.${error.reason}`);
    } else {
      if (error.data && error.data.message) customError = error.data.message;
      else if (typeof error.message !== "undefined")
        customError = error.message;
    }
    errToasterBox(customError);
    setSaving(false);
  };

  const signMessage = useSignMessage({ onSuccess, onError });

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
      setLang(lang);
    }
    changeLanguage();
  }, [i18n.language]);

  // Get Country Name on current displayed language
  // receive Alplha-3 three letter Country Code  and get name
  const getCountryName = (threeLetterCodeCountry) => {
    return countries.getName(threeLetterCodeCountry, lang);
  };

  const proceedToSign = async () => {
    setShowSignMsg(false);
    await signMessage(message);
  };

  // ********************** handlers *************************
  const handleOptionChange = (event) => {
    setsDownloadFolderOption(event.target.value);
  }

  // Validate and Update data to DB
  const handleSave = async () => {
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      // strips these keys as we don't want to overwrite their values, only editable fields allowable
      if (!["rfpWon", "rfpSent", "companyRFPs", "profileCompleted"].includes(key)) {
        trimmedValues[key] = typeof value !== "undefined" ? value.trim() : "";
      }
    }

    if (!validate(
        patronobligatorio,
        trimmedValues.adminname,
        t("companyform.nameerror")
      ))
      return;
    if (!validate(patronemail, trimmedValues.email, t("companyform.emailerror"))
    )
      return;
    if (trimmedValues.website && !validate (
        patronwebsite,
        trimmedValues.website,
        t("companyform.websiteerror")
      )
    )
      return;

    if (downloadFolderOption.trim()==='') {
      errToasterBox(t("companyform.nodownloadfolererror"))
      return;
    }

    // add downloadFolderOption value to the trimmedValues:
    trimmedValues.downloadFolderOption = downloadFolderOption
      // Display modal to show & ask to sign message
    const message = JSON.stringify(trimmedValues);
    setMsgtoSign(message);
    setSaving(true);
    setShowSignMsg(true);
  };

  const inputclasses =
    "require leading-normal flex-1 border-0  border-grey-light " &&
    "rounded rounded-l-none outline-none pl-10 w-full bg-stone-100 focus:bg-blue-100 font-khula font-extrabold";

  /*const patronemail = new RegExp(
    "^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );*/

  const patronemail = new RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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
    <div className="container mx-auto w-[80%] ">
      <SignMsgAlert
        showSignMsg={showSignMsg}
        msgWarning={t("showsigningmsg")}
        signMsg={t("signmessage", { ns: "common" })}
        handleSigning={proceedToSign}
      />
      <div
        id="dataentrypanel"
        className="mt-2  p-4 bg-white  border-orange-200 rounded-md container  my-8 mx-4 border-2 border-solid"
      >
        <div className="flex items-center mt-2 mb-4" >
          <Image alt="DataEntry" src={'/dataentry.svg'} width={22} height={22}></Image>
            <p className="text-stone-500 text-bold text-lg mt-2 ml-2 font-khula">
            {t("companyform.recordcompanytitle")}
            </p>
        </div>
        <form
          action=""
          className={`flex flex-col items-center justify-between leading-8 mb-8`}
        >
          <div className="w-[80%] relative mb-4 flex bg-stone-100">
            <GlobeIcon className="h-5 w-5 text-orange-400 mt-1 ml-2" />
            <p className="pl-4 text-stone-500 font-khula font-extrabold">{getCountryName(companyData.country)}</p>
          </div>
          <div className="w-[80%] relative mb-4">
            <InputCompanyId
              handleChange={handleChange}
              inputclasses={inputclasses + "text-stone-500"}
              values={values}
              placeholder={`${t("companyform.companyId")}*`}
              disable={true}
            />
          </div>
          <div className=" w-[80%] relative mb-4">
            <InputCompanyName
              handleChange={handleChange}
              inputclasses={inputclasses + "text-stone-500"}
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
            {/* ******* File Downloading settings      ********************** */}
            <div id="downloadsettingsframe" className="mt-4 ">
              <label className=" text-stone-500">{t('downloadsettings')}</label>
              <div className="flex flex-col w-[80%] mt-2 mb-4 border-[1px] border-orange-500 p-2 rounded-lg text-sm text-stone-500">
                <label className="inline-flex items-center mb-2">
                  <input
                    type="radio"
                    className="form-radio"
                    value="default"
                    checked={downloadFolderOption === 'default'}
                    onChange={handleOptionChange}
                    />
                  <span className="ml-2">{t('companyform.defaultdownloadfolder')}</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="custom"
                    checked={downloadFolderOption === 'custom'}
                    onChange={handleOptionChange}
                    />
                  <span className="ml-2">{t('companyform.userchoosedfolder')}</span>
                </label>
              </div>
            </div>
          {/* **************************************************************************************** */}
        </div>
        </form>
        <div id="footersubpanel3 ">
          <div className="py-4 flex flex-row justify-end border-t border-gray-300 rounded-b-md">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`main-btn ${saving ? "cursor-not-allowed" : ""}`}
              >
                {!saving ? `${t("savebutton")}` : ""}
                {saving && (
                  <div className=" flex justify-evenly items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900"></div>
                    <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
                  </div>
                )}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => router.push({ pathname: "/" })}
                className={`ml-4 secondary-btn ${saving && "cursor-not-allowed bg-stone-400"}`}
                >
                {t("closebutton")}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyDataForm;
