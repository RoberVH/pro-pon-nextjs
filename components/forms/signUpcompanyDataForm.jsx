/**
 * SignUpCompanyDataForm
 *    When user has authorized Pro-pon to access Metamask account , a button to register is presented if hasn't yet done it
 *    When clicking register button at main screen is presented with this form to record company essential Data
 *    Essential Data:  company Id, name, and country
 */

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";
import TxInfoPanel from "../../components/TxInfoPanel";
import { errorSmartContract } from "../../utils/constants";
import countries from "i18n-iso-countries";
import { GlobeIcon } from "@heroicons/react/outline";
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import {
  saveCompanyID2DB,
  getCompanydataDB,
  savePendingTx,
} from "../../database/dbOperations";
import { InputCountrySel } from "../input-controls/InputCountrySel";
import { useWriteCompanyData } from "../../hooks/useWriteCompanyData";
import { proponContext } from "../../utils/pro-poncontext";
import { getCurrentRecordCompanyPrice } from "../../web3/getCurrentContractConst";
import { parseWeb3Error } from "../../utils/parseWeb3Error";
import DismissedTxNotice from "../layouts/dismissedTxNotice";
import { todayUnixEpoch } from "../../utils/misc";

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);

const inputclasses = `leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none 
                    font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100 py-1`;

/**
 * SignUpCompanyDataForm is a React functional component that manages posting
 * essential (name, id and country) company data to contract.
 * @param {object} setCompanyData - Callback function for setting company data in parent component.
 * @param {object} companyData - Object containing current company data from parent component.
 */
const SignUpCompanyDataForm = ({ setCompanyData, companyData }) => {
  // State Variables & constants of module
  const { t, i18n } = useTranslation(["signup", "rfps", "gralerrors"]);
  const [companyCreated, setcompanyCreated] = useState(false);
  const [lang, setLang] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const [taxPayerPlaceHolder, setTaxPayerPlaceHolder] = useState("companyId");
  const [noticeOff, setNoticeOff] = useState({ fired: false, tx: null });
  const [droppedTx, setDroppedTx] = useState();
  const [actionButtonClicked, setButtonClicked] = useState(false);
  // processingTxBlockchain flag to control when TX was send: it shows cancel transaction button on ShowTxSummary
  const [processingTxBlockchain, setProTxBlockchain] = useState(false);

  const { values, handleChange } = useInputForm();
  const [profileCompleted, setProfileCompleted] = useState(
    companyData && typeof companyData.profileCompleted !== "undefined"
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
      setLang(lang);
    }
    // Call function to change language
    changeLanguage();
  }, [i18n.language]);

  // Get Country Name on current displayed language
  // receive Alplha-3 three letter Country Code
  const getCountryName = (threeLetterCodeCountry) => {
    // Return country name in current displayed language
    return countries.getName(threeLetterCodeCountry, lang);
  };

  const onSuccess = async (data) => {
    await saveCompanyData(address);
    // we need to read what we just write to retrieve DB id of record and have it on the context
    const result = await getCompanydataDB(values.companyId.trim()); // read from DB company data
    if (!result.status) {
      errToasterBox(t(result.msg, { ns: "gralerrors" }));
      return;
    }

    setCompanyData(result.data); // write db record to context with id that we'll use to update it
    setcompanyCreated(true);
  };

  const onError = (error) => {
    // default answer, now check if we can specified it
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    return;
  };

  const { write, postedHash, block, blockchainsuccess } = useWriteCompanyData({
    onError,
    onSuccess,
    isCancelled,
    setProTxBlockchain,
  });

  const router = useRouter();

  const patronobligatorio = new RegExp("^(?!s*$).+");

  // Function to display error msg
  const errToasterBox = (msj) => {
    setProTxBlockchain(false);
    setButtonClicked(false);
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

  // ********* Handlers ***************************************************************************************

  const handleDataEdition = () => {
    router.push({ pathname: "/companyprofile" });
  };

  // handleCacel Drop form and go back to root url
  const handleCancelTx = async () => {
    setIsCancelled(true);
    // create a copy of droppedTx object
    const updatedTxObj = { ...droppedTx };
    // update txLink property with the link value
    updatedTxObj.txHash = postedHash;
    // pass updatedTxObj to setNoticeOff function
    setNoticeOff({ fired: true, txObj: updatedTxObj });
    const result = await savePendingTx({ ...updatedTxObj, sender: address }); // Pass the object and add who issued the Tx
    if (!result.status) {
      const msgErr = parseWeb3Error(t, { message: result.msg });
      errToasterBox(msgErr);
    } else {
      // notify Tx was saved
      toast.success(t("pendingtxsaved", { ns: "rfps" }));
    }
    setButtonClicked(false);
    setProTxBlockchain(false);
  };

  const handleClosePanel = () => {
    setProTxBlockchain(false);
  };

  const handleClose = () => {
    router.push({ pathname: "/" });
  };

  // handleSave -  call Validate fields & if ok send transaction to blockchain
  const handleSave = async () => {
    setButtonClicked(true);
    setIsCancelled(false); // reset state in case user is retrying operation
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
    }
    if (
      !validate(
        patronobligatorio,
        trimmedValues.companyId,
        t("companyform.companyIDerror")
      )
    )
      return;
    if (
      !validate(
        patronobligatorio,
        trimmedValues.companyname,
        t("companyform.companynamerror")
      )
    )
      return;
    if (
      !validate(
        patronobligatorio,
        trimmedValues.country,
        t("companyform.countryerror")
      )
    )
      return;

    // validation passed ok,
    // create entry on smart contract
    const result = await getCurrentRecordCompanyPrice();
    if (!result.status) {
      errToasterBox(t("no_blockchain_access", { ns: "gralerrors" }));
      return;
    }
    const price = result.createCoPrice;
    const today = todayUnixEpoch(new Date());
    const Tx = {
      type: "registercompany",
      date: today,
      params: [
        trimmedValues.companyId,
        trimmedValues.companyname,
        trimmedValues.country,
      ],
    };
    setDroppedTx(Tx);
    await write(
      trimmedValues.companyId,
      trimmedValues.companyname,
      trimmedValues.country,
      price
    );
  };

  // Save companyId & companyname to App context to appear on App Heading
  const saveCompanyData = async (address) => {
    const companyID = values.companyId.trim();
    const companyName = values.companyname.trim();
    const country = values.country.trim();
    // company has been created at smart contract, now reflect on Mongo DB
    // and save the data we already have. Set profileCompleted DB field to false
    // so user will have to fill that later
    // Dic 2022 added address to save time when inviting companies to RFP and need to recover it
    const result = await saveCompanyID2DB(
      companyID,
      companyName,
      country,
      address
    );
    if (!result.status) errToasterBox(t(result.msg, { ns: "gralerrors" }));
  };

  // render of Component
  return (
    <div id="generalsavearea" className="container mx-auto">
      {noticeOff.fired && (
        <div className="fixed inset-0 bg-transparent z-50">
          <div className="fixed top-[30%] left-[30%] ">
            <DismissedTxNotice
              notification={t("dropped_tx_notice", { ns: "rfps" })}
              buttonText={t("accept", { ns: "rfps" })}
              setNoticeOff={setNoticeOff}
              dropTx={noticeOff.txObj}
              typeTx={t(`transactions.${noticeOff.txObj.type}`, { ns: "rfps" })}
            />
          </div>
        </div>
      )}
      {/* Entry Form with buttons save & cancel */}
      <div
        id="dataentrypanel"
        className="lg:w-[120%] xl:w-[95%] mx-auto mt-4 mb-4 p-4 bg-white border border-orange-300 rounded-md container shadow-md"
      >
        <div className="flex items-center mt-2 z-50 ">
          <Image
            alt="DataEntry"
            src={"/dataentry.svg"}
            width={22}
            height={22}
          ></Image>
          <p className="text-components text-bold  mt-2 ml-2 font-work-sans">
            {t("companyform.recordessentialdata")}
          </p>
        </div>
        <form
          action=""
          className="flex flex-col items-center justify-between leading-8 my-6"
        >
          <div className="lg:w-[80%] xl:w-[70%] 3xl:w-[65%]  relative mb-2 text-xs lg:text-md ">
            {typeof companyData.profileCompleted === "undefined" ? (
              // Company not yet registered to blockchain contract
              <React.Fragment>
                <p className=" text-stone-500 mb-2">
                  {t("companyform.essentialfilldata")}
                </p>
                <InputCountrySel
                  t={t}
                  i18n={i18n}
                  handleChange={handleChange}
                  values={values}
                  setPlaceHolder={setTaxPayerPlaceHolder}
                  companyData={companyData}
                  profileCompleted={profileCompleted}
                  disable={companyCreated || actionButtonClicked}
                />
                <div className="relative mb-4 mt-4">
                  <InputCompanyId
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    placeholder={`${t("companyform." + taxPayerPlaceHolder)}*`}
                    disable={companyCreated || actionButtonClicked}
                  />
                </div>
                <div className="relative mb-4">
                  <InputCompanyName
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    placeholder={`${t("companyform.companyname")}*`}
                    disable={companyCreated || actionButtonClicked}
                  />
                </div>
                <div className="mt-8 mx-auto">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={actionButtonClicked}
                    className="main-btn"
                  >
                    {t("savebutton")}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={actionButtonClicked}
                    className="ml-4 secondary-btn"
                  >
                    {t("closebutton")}
                  </button>
                </div>
              </React.Fragment>
            ) : (
              // Company already registered to blockchain contract
              <React.Fragment>
                <p className="font-work-sans text-stone-500 text-components mb-3 ">
                  {t("companyform.dataofaccount")}
                </p>
                <div className="flex bg-stone-100 ">
                  <GlobeIcon className="h-4 w-4 sm:h-5 sm:w-5   2xl:w-5  text-orange-400 mt-2  ml-2 " />
                  <p className="pl-4 my-2">
                    {getCountryName(companyData.country)}
                  </p>
                </div>
                <div className="relative mb-4 mt-4">
                  <InputCompanyId
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={{ companyId: companyData.companyId }}
                    placeholder={`${t("companyform." + taxPayerPlaceHolder)}*`}
                    disable={true}
                  />
                </div>
                <div className="relative ">
                  <InputCompanyName
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={{ companyname: companyData.companyname }}
                    placeholder={`${t("companyform.companyname")}*`}
                    disable={true}
                  />
                </div>
                <div className="mt-8 mx-auto flex justify-end">
                  <button
                    type="button"
                    onClick={handleDataEdition}
                    // disabled={actionButtonClicked}
                    className="main-btn"
                  >
                    {t("completeprofile")}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    // disabled={actionButtonClicked}
                    className="ml-4 secondary-btn"
                  >
                    {t("closebutton")}
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        </form>
      </div>

      {processingTxBlockchain && (
        <div className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <TxInfoPanel
              hash={postedHash}
              block={block}
              handleCancelTx={handleCancelTx}
              handleClosePanel={handleClosePanel}
              t={t}
              blockchainsuccess={blockchainsuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};
//export default SignUpCompanyDataForm;
export default React.memo(SignUpCompanyDataForm);
