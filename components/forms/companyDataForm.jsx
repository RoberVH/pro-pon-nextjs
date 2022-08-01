import { useState, useContext, useRef } from "react";
import { useTranslation } from "next-i18next";
import { proponContext } from "../../utils/pro-poncontext";
import { useSignMessage } from "wagmi";
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";

import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";

import { InputWebsite } from "../input-controls/InputWebsite";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import { InputEmail } from "../input-controls/InputEmail";
import { InputAdminName } from "../input-controls/InputAdminName";

import { verifyData_Save } from '../../database/dbOperations'
import { useEffect } from "react";

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);
import ethers from 'ethers'



/**
 * CompanyDataForm
 *    Present stepper step 3 to register rest of company data to DB form
 *    This form can only acept data if and only if the context has already the company ID &
 *    company name. This value could have been set in the immidiate step 2 prior to this or if
 *    Tx took too much time, later, when user navigate to this screen and have read the data
 *    from the blockchain for this address
 *
 */
const CompanyDataForm = ({client}) => {
  const { t, i18n } = useTranslation("signup");
  const [saving, setSaving] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const { companyName, CompanyId, companyData } = useContext(proponContext);
  const { values, handleChange } = useInputForm(companyData);
  const [profileCompleted, setProfileCompleted] = useState(
    companyData && companyData.profileCompleted
      ? companyData.profileCompleted
      : false
  );
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const recoveredAddress = useRef()
  const { data, error, isLoading, signMessage } = useSignMessage({
    //message:'Firme este mensaje para probar que desea hacer esta operacion. No se preocupe, no constará nada ' + nonce,
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      //const address = verifyMessage(variables.message, data)
      console.log("data", data);
      console.log("variables", variables.message);
      verifyData_Save(variables.message,data)
      
    },
  });

  useEffect(() => {
    if (!companyId) {
      errToasterBox(t("nocompanyIdyet"), {
        ...{ autoClose: false },
        toastStyle,
      });
    }
  }, []);

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
    }
    changeLanguage();
  }, [i18n.language]);



  // Validate and Save data to DB
  const handleSave = async () => {
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      if (key !== "profileCompleted")
        trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
      else trimmedValues[key] = value;
    }
    // if (
    //   !validate(
    //     patronobligatorio,
    //     trimmedValues.adminname,
    //     t("companyform.nameerror")
    //   )
    // )
    //   return;
    // if (
    //   !validate(
    //     patronobligatorio,
    //     trimmedValues.companyname,
    //     t("companyform.companynamerror")
    //   )
    // )
    //   return;
    // if (
    //   !validate(
    //     patronobligatorio,
    //     trimmedValues.companyId,
    //     t("companyform.companyIDerror")
    //   )
    // )
    //   return;
    // if (
    //   !validate(patronemail, trimmedValues.email, t("companyform.emailerror"))
    // )
    //   return;
    // if (
    //   !validate(
    //     patronwebsite,
    //     trimmedValues.website,
    //     t("companyform.websiteerror")
    //   )
    // )
    //   return;
    // if (
    //   typeof trimmedValues.country === "undefined" ||
    //   trimmedValues.country.length === 0
    // ) {
    //   errToasterBox(t("companyform.countryerror"));
    //   return;
    // }
    // validation passed ok, let's save on DB (google sheet)
    //const nonce= await client
    //console.log('client, ', )
   // console.log('nonce, ', nonce)
    //setSaving(true);
    //Make sure user has rights to modify company
    // get nonce to sign:

    // Display modal to show & ask to sign message
    const message = JSON.stringify(trimmedValues )
    // console.log('message', message)
    // console.log('{message}', {message})
    await signMessage({message})
    
    return
    let method = "POST";
    if (profileCompleted) method = "PATCH";
    try {
      const response = await fetch("/api/servercompanies", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedValues),
      });
      const resp = await response.json();
      if (resp.status) toast.success(t("successsaving"), toastStyle);
      return;
    } catch (error) {
      console.log("Error del server:", error);
      errToasterBox(error, toastStyle);
    } finally {
      setSaving(false);
    }
  };

  const inputclasses =
    "require leading-normal flex-1 border-0  border-grey-light " &&
    "rounded rounded-l-none  outline-none pl-10 w-full focus:bg-blue-100 font-khula font-extrabold";

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
    <div
      id="dataentrypanel"
      className="w-[74%]   relative p-4 bg-gray-100 border-2xl"
    >
      <p className="text-gray-600 text-extrabold text-xl mb-10 font-khula">
        {t("companyform.recordcompanytitle")}
      </p>
      <form
        action=""
        className="flex flex-col items-center justify-between leading-8 mb-8 
          "
      >
        <div className="w-[80%] relative mb-4">
          <InputCompanyId
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyId")}*`}
            disable={profileCompleted}
          />
        </div>
        <div className=" w-[80%] relative mb-4">
          <InputCompanyName
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyname")}*`}
            disable={profileCompleted}
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
        <div className="w-[80%] relative mb-4">
          <select
            className="form-select block w-full px-3 py-1.5 text-base font-roboto bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300 outline-none rounded transition ease-in-out
                    m-0 border-0 border-grey-light rounded rounded-l-none focus:bg-blue-100 
                    text-gray-500 font-khula "
            onChange={handleChange}
            id={"country"}
            defaultValue={"default"}
          >
            <option value={"default"} disabled>
              {!profileCompleted
                ? `${t("companyform.country")}*`
                : values.country}
            </option>
            {countryList.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div id="footersubpanel3">
        <div className="py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md">
          <div className=" mt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-400 font-xl font-bold font-khula  mr-10 px-4 py-2.5  
                    text-white leading-tight uppercase rounded shadow-md hover:bg-orange-700 active:hover:shadow-lg 
                    active:focus:bg-orange-700 focus:shadow-lg active:focus:outline-none active:focus:ring-0 active:bg-orange-800 
                    active:shadow-lg transition duration-150 ease-in-out disabled:bg-orange-400"
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
              onClick={handleSave}
              className="bg-stone-400 font-xl font-bold font-khula   px-4 py-2.5  
                    text-white leading-tight uppercase rounded shadow-md hover:bg-stone-700 hover:shadow-lg 
                    focus:bg-stone-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-stone-800 
                    active:shadow-lg transition duration-150 ease-in-out
                    ${saving===5 ? 'cursor-not-allowed' : ''}`"
            >
              {t("cancelbutton")}
            </button>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};
export default CompanyDataForm;
