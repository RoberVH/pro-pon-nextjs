/**
 * RFPDataForm
 *    Present input form to register RFP and post it to blockchain,
 *    Display spinners when waiting and indicators of progress: Tx hash, block tx included
 *    Save data to DB collections RFPs when is confirmed to the blockchain (?)
 */

// TEMPO cambiar despliegue de fecha para evitar esa T o al menos separarla:
//USAR:
//    const date = new Date().toISOString().replace('T', ' ').split('.')[0];

import { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ShowTXSummary from "../rfp/ShowTXSummary";
import Image from "next/image";
import { useWriteRFP } from "../../hooks/useWriteRFP";
import { saveRFP2DB } from "../../database/dbOperations";
import { proponContext } from "../../utils/pro-poncontext";
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import { parseWeb3Error } from "../../utils/parseWeb3Error";
import { getCurrentRFPPrices } from "../../web3/getCurrentContractConst";
import useInputForm from "../../hooks/useInputForm";
import { InputRFPName } from "../input-controls/InputRFPName";
import { InputRFPDescription } from "../input-controls/InputRFPDescription";
import { InputRFPwebsite } from "../input-controls/InputRFPwebsite";
import { buildRFPURL } from "../../utils/buildRFPURL";
import { todayUnixEpoch } from "../../utils/misc";

import "react-toastify/dist/ReactToastify.css";


import { InputDate } from "../input-controls/InputDate";
import RFPItemAdder from "../rfp/RFPItemAdder";
//import SpinnerBar from "../layouts/SpinnerBar"

const inputclasses = `
       leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none  
      font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100 text-components py-1 `;

const validatingFields = new Map([
  ["openDate", "rfpform.opendateerror"],
  ["endReceivingDate", "rfpform.endrecerror"],
  ["endDate", "rfpform.enddateerror"],
]);

const ContestType = { OPEN: 0, INVITATION_ONLY: 1 };
const openContest = ContestType.OPEN;
const invitationContest = ContestType.INVITATION_ONLY;

const RFPDataForm = ({ setNoticeOff }) => {
  // State Variables & constants of module
  const { t } = useTranslation(["rfps", "gralerrors"]);
  //const infoBoardDiv = useRef()
  const [rfpParams, setRFPParams] = useState({});
  const [rfpCreated, setrfpCreated] = useState(false);
  const [items, setItems] = useState({});
  const [showItemsField, setShowItemsField] = useState(false);
  const [contestType, setContestType] = useState(openContest);
  const [droppedTx, setDroppedTx] = useState();
  const [isCancelled, setIsCancelled] = useState(false);

  //**************************
  // processingTxBlockchain flag to control when TX was send: it shows cancel transaction button on ShowTxSummary
  const [processingTxBlockchain, setProTxBlockchain] = useState(false);
  // signals a button that will trigger a metamask confirm and hence a write has been clicked to disable such buttons
  // disabling them, they are
  const [actionButtonClicked, setButtonClicked] = useState(false);

  const { values, handleChange } = useInputForm();
  const router = useRouter();

  const patronobligatorio = new RegExp("^(?!s*$).+");
  const { companyData } = useContext(proponContext);

  // Function to display error msg
  const errToasterBox = (msj) => {
    errToasterBox;
    setButtonClicked(false); // there was an error not matter where, so turn back saving RFP button clicked
    toast.error(msj, toastStyle);
  };

  const handleCheckItemsAdder = (e) => {
    if (Object.keys(items).length) {
      errToasterBox(t("remove_items_first"));
      e.preventDefault();
      return;
    } else setShowItemsField(!showItemsField);
  };

  const saveRFPDATA2DB = async (params) => {
    const resp = await saveRFP2DB(params);
    if (resp.status) {
      // we retrieve the address of the rfp owner from OnEvent event as we need it but it's not in this form component.
      // then we set the whole RFP params to be include on the URL that edit RFP button will trigger
      setRFPParams((rfpparams) => ({ ...rfpparams, rfpidx: params.rfpidx }));
      toast.success(t("rfpdatasaved", toastStyleSuccess));
      setrfpCreated(true);
    }
    // if there was an error saving to DB the RFP record. Consequence will be that it won't appear on
    // RFP searches, but this won't hinder the RFP process as that process won't rely on DB but on contract data
    // there shall be a function when reading RFP from contract to check if exist in DB and updated the RFP there if needed
    // so we don't show error here and let it pass silently, that's why there is not else branch here showing
  };

  // Handle Error method passed unto useWriteRFP hook
  const onError = (error) => {
    setButtonClicked(false);
    setProTxBlockchain(false);
    errToasterBox(customError);
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    // setWaiting(false)web
  };

  // onEvent Handle method passed unto useWriteRFP hook  to save RFP data to DB record when event is received from contrat
  const onEvent = async (address, rfpIdx, rfpName, params) => {
    console.log('rfp event called')
    if (isCancelled) {
      // if user cancelled but Tx still pass through, don't save to DB as it could try to display msg on no UI
      setIsCancelled(false); // reset state
      return;
    }
    const rfpidx = parseInt(rfpIdx);
    if (!rfpCreated) {
      // this is if RFP hasn't been saved to DataBase yet
      const rfpparams = { rfpidx, issuer: address, ...params };
      saveRFPDATA2DB(rfpparams);
    }
  };

  const onSuccess = (data) => {
    console.log('succes called!')
    setButtonClicked(false);
  };

  // Set our writing hook
  //const { write, postedHash, block, blockchainsuccess} = useWriteRFP({ onSuccess, onError, onEvent,  setLink, isCancelled, setProTxBlockchain})
  const { write, postedHash, block, blockchainsuccess } = useWriteRFP({
    onSuccess,
    onError,
    onEvent,
    isCancelled,
    setProTxBlockchain,
  });

  // Validate using regexp input fields of rfp essential data form
  const validate = (pattern, value, msj) => {
    const trimValue = (typeof value !== "undefined" ? value : "").trim();
    if (!pattern.test(trimValue)) {
      errToasterBox(msj);
      return false;
    } else {
      return true;
    }
  };

  // Receive a date with format 'YYYY-MM-DD';
  // Need to add currennt time in format hh:mm before getting Unix Epoch to have exact time
  const convertDate2UnixEpoch = (dateStr) => {
    // add current time to date
    const currentDateTime = new Date(dateStr);
    const unixTimestamp = Math.floor(currentDateTime.getTime() / 1000);
    return unixTimestamp;
  };

  const validateDate = (pattern, value, msj) => {
    if (typeof value === "undefined" || !pattern.test(value)) {
      errToasterBox(msj);
      return [null, false];
    } else {
      const dateUnix = convertDate2UnixEpoch(value);
      return [dateUnix, true];
    }
  };

  // handleClose. Go back to root address
  const handleClose = () => {
    router.push({ pathname: "/" });
  };

  // handleClose. Go back to root address
  const handleClosePanel = () => {
    setProTxBlockchain(false);
  };

  // handleCancelTx. Cancel Tx. Save Tx data to DB for it to appear on My Pending Tx menu option
  //      TX is taking long, user has click cancel to abort waiting
  //      Tx still can go through but we won't wait for it
  const handleCancelTx = () => {
    // hide info panel
    setIsCancelled(true);
    //setPostedHash('')
    // setWaiting(false)
    // create a copy of droppedTx object
    const updatedTxObj = { ...droppedTx };
    // update txLink property with the link value
    updatedTxObj.txHash = postedHash;
    // pass updatedTxObj to setNoticeOff function
    setNoticeOff({ fired: true, txObj: updatedTxObj });
    setProTxBlockchain(false);
    setButtonClicked(false); // give user a chance to resubmit when form still have its data on the form
  };

  // handle Edit RFP button method, Build urk with RFP params and set URL browser to that URL
  const handleEditRFP = () => {
    // here to pass only needed params
    const urlLine = {
      companyId: rfpParams.companyId,
      companyname: rfpParams.companyname,
      rfpidx: rfpParams.rfpidx,
    };
    const params = buildRFPURL(urlLine);
    router.push("/homerfp?" + params);
  };

  const handleClickContestType = (e) => {
    setContestType(e.target.id === "open" ? openContest : invitationContest);
  };

  //************************************************************
  // handleSaveRFP -  call Validate fields & if ok send Write transaction to blockchain
  // ***********************************************************
  const handleSaveRFP = async () => {
    setButtonClicked(true);
    const arrayItems = Object.entries(items).map((item) => item[1]);
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
    }
    // validate all fields
    // RFP name
    if (
      !validate(patronobligatorio, trimmedValues["name"], t("rfpform.namerror"))
    )
      return;

    // Dates
    const dates = [];

    for (const [field, errormessage] of validatingFields) {
      const [convertedDate, status] = validateDate(
        patronobligatorio,
        trimmedValues[field],
        t(errormessage)
      );
      if (!status) return;
      else dates.push(convertedDate);
    }
    if (dates[0] >= dates[1] || dates[1] >= dates[2]) {
      errToasterBox(t("rfpform.datesnosequencial"));
      return;
    }
    // late addition: check initial date is not older than 50 minutes ago!
    if (dates[0] < Math.floor(new Date().getTime() / 1000) - 3000) {
      errToasterBox(t("rfpform.beginingdaterror"));
      return;
    }
    // validation passed ok
    // create entry on smart contract

    // setting rfpparams for when the time comes to save to the database!
    const params = {
      companyId: companyData.companyId,
      companyname: companyData.companyname,
      name: trimmedValues["name"],
      description: trimmedValues["description"] + "", // in case they let it empty,
      rfpwebsite: trimmedValues["rfpwebsite"] + "", // in case they let it empty
      openDate: dates[0],
      endReceivingDate: dates[1],
      endDate: dates[2],
      contestType: contestType,
      items: arrayItems,
    };
    if (params.description === "undefined") params.description = "";
    if (params.rfpwebsite === "undefined") params.rfpwebsite = "";

    setRFPParams(params);
    const { openPriceRPF, invitationRFPPrice } = await getCurrentRFPPrices()

    // Different prices for RFP Type. If Open, Issuer will be paying for document uploads
    // so that price will be expensier. If Open, each bidder will paid for that. So, it should cost less
    const value =
      contestType === ContestType.OPEN ? openPriceRPF : invitationRFPPrice;
    //save to droppedTX the params in case user cancel in the middle
    const today = todayUnixEpoch(new Date());
    const Tx = { type: "createrfp", date: today, params };
    setDroppedTx(Tx);
    // writing essential RFP data to contract
    await write(params, value);
  };

  // Some objects to style UX
  //const itemStyleContainer = { true: "w-[85%]", false: "w-[55%] xl:w-[45%]" }; // adjust size if not showing item (partidas) edit frame
  const itemStyleContainer = {
    true: "w-full md:w-[85%]",
    false: "w-full md:w-[55%] xl:w-[45%]",
  }
  
  const itemStyleInputName = { true: "w-[85%]", false: "w-[130%]" };
  const itemStyleDate = { true: "w-[75%]", false: "lg:w-[120%] xl:w-[120%]" };
  const itemStyleCheckboxText = {
    true: "w-[90%]",
    false: "lg:w-[100%] xl:w-[90%]",
  };

  // render of Component rfpDataForm *****************************************************
  return (
    <div id="generalsavearea">
      {/* Entry Form with buttons save & cancel */}
      <div
        id="dataentrypanel"
        className={`container ${itemStyleContainer[showItemsField]} p-4 bg-white border-xl border-2 border-orange-200 rounded-md`}
      >
        <div className="flex items-center text-components">
          <Image
            alt="DataEntry"
            src={"/dataentry.svg"}
            width={22}
            height={22}
          ></Image>
          <p className="text-gray-600 text-extrabold md:text-sm sm:text-sm lg:text-xs xl:text-base  mt-2 ml-2 font-work-sans">
            {t("recresrfpdata")}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            id="essentialdatacontainer"
            className="flex flex-col items-left justify-between leading-8 mt-8  pl-8 "
          >
            <form
              action=""
              className="mb-8 text-xs"
              disabled={rfpCreated || actionButtonClicked}
            >
              <div
                className={`${itemStyleInputName[showItemsField]} relative flex mb-4`}
              >
                <InputRFPName
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  placeholder={`${t("rfpform.name")}*`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={`${itemStyleInputName[showItemsField]} relative flex mb-4`}
              >
                <InputRFPDescription
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  placeholder={`${t("rfpform.description")}`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={`${itemStyleInputName[showItemsField]} relative flex mb-4`}
              >
                <InputRFPwebsite
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  placeholder={`${t("rfpform.rfpwebsite")}`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={`${itemStyleDate[showItemsField]} relative flex mb-4`}
              >
                <InputDate
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  dateId={"openDate"}
                  placeholder={`${t("rfpform.openDate")}*`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={`${itemStyleDate[showItemsField]} relative flex mb-4`}
              >
                <InputDate
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  dateId={"endReceivingDate"}
                  placeholder={`${t("rfpform.endReceivingDate")}*`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={`${itemStyleDate[showItemsField]} relative flex mb-4`}
              >
                <InputDate
                  handleChange={handleChange}
                  inputclasses={inputclasses}
                  values={values}
                  dateId={"endDate"}
                  placeholder={`${t("rfpform.endDate")}*`}
                  disable={rfpCreated || actionButtonClicked}
                />
              </div>
              <div
                className={` bg-stone-100 p-2 flex ${itemStyleDate[showItemsField]}`}
              >
                <label className="text-stone-500 text-xs  ">{t("contestType")}</label>
                <br></br>
                <div className="ml-12 flex justify-start">
                  <label
                    id="open"
                    title={t('open_type_contest')}
                    className={`mr-4 mt-1 cursor-pointer text-xs 
                        ${
                          contestType === openContest
                            ? "bg-blue-200 px-2 py-1  rounded-3xl"
                            : "py-1"
                        }
                        ${
                          rfpCreated || actionButtonClicked
                            ? "pointer-events-none"
                            : ""
                        }`}
                    onClick={handleClickContestType}
                  >
                    {t("open").toUpperCase()}
                  </label>
                  <label
                    id="invitation"
                    title={t('invitation_type_contest')}
                    className={`mx-4 mt-1 cursor-pointer  text-xs 
                        ${
                          contestType === invitationContest
                            ? "bg-blue-200 px-2 py-1  rounded-3xl"
                            : "py-1"
                        }
                        ${
                          rfpCreated || actionButtonClicked
                            ? "pointer-events-none"
                            : ""
                        }`}
                    onClick={handleClickContestType}
                  >
                    {t("invitation").toUpperCase()}
                  </label>
                </div>
              </div>
              <div id="optionalCheckmark" className="flex mt-8 ">
                <input
                  onClick={handleCheckItemsAdder}
                  disabled={rfpCreated || actionButtonClicked}
                  className="mr-4"
                  type="checkbox"
                  value={showItemsField}
                />
                <div
                  className={`text-components ${itemStyleCheckboxText[showItemsField]}`}
                >
                  <p
                    className={`text-components text-stone-600 font-work-sans ${itemStyleInputName[showItemsField]}`}
                  >
                    <strong>{t("optional")}&nbsp;</strong>
                    {t("additemscheckbox")}{" "}
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div id="ItemsForm">
            <RFPItemAdder
              items={items}
              setItems={setItems}
              showItemsField={showItemsField}
              disable={rfpCreated || actionButtonClicked}
            />
          </div>
        </div>
        <div id="footersubpanel3 ">
          <div
            className={` mt-4 pt-4 pb-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md w-[100%]
                ${rfpCreated ? "hidden" : null}`}
          >
            <div className="mt-4 mr-10">
              <button
                type="button"
                onClick={handleSaveRFP}
                disabled={actionButtonClicked}
                className="main-btn"
              >
                {t("savebutton")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {processingTxBlockchain && (
        <div className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50">
          <div className="fixed  left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <ShowTXSummary
              postedHash={postedHash}
              block={block}
              t={t}
              handleClosePanel={handleClosePanel}
              blockchainsuccess={blockchainsuccess}
              handleCancelTx={handleCancelTx}
            />
          </div>
        </div>
      )}

      {rfpCreated && (
        <div
          className="mx-auto mt-4 bg-white border-2 border-orange-200 shadow-xl p-4 font-work-sans text-stone-700 text-base 
                            rounded-md w-[60%] "
        >
          <p>{t("rfpessentialdatasaved")} </p>
          <div className="flex justify-center">
            <button className="main-btn mr-8 mt-8" onClick={handleEditRFP}>
              {t("editrfp")}
            </button>
            <button
              className="main-btn ml-8 mt-8 secondary-btn"
              onClick={handleClose}
            >
              {t("closebutton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default RFPDataForm;
