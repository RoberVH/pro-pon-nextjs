/**
 *  RegisterBidder
 *  Component that gets render when dealing with a OPEN contest
 *  it allows a company to register to the Open RFP
 *  it detects and warns in case company is already registered
 *  params: inviteContest - Boolean if false then is an open contest
 */

import { useState, useEffect, useRef } from "react"
import SearchDB from "../SearchDB"
import DisplayResults from "../DisplayResults"
import Spinner from "../layouts/Spinner"
import { companyFields } from "../../utils/companyFieldsonRFP"
import { nanoid } from "nanoid"
import Image from 'next/image'
import GralMsg from '../layouts/gralMsg'
// toastify related imports
import "react-toastify/dist/ReactToastify.css"
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle"
import { toast } from "react-toastify"
import { useRegisterBidders } from "../../hooks/useRegisterBidders"
import { useBidders } from "../../hooks/useBidders"
import ShowTXSummary from "./ShowTXSummary"
import { parseWeb3Error } from "../../utils/parseWeb3Error"
import ModalWindow from "../layouts/modalWIndow"
import  { getCompanydataDB } from "../../database/dbOperations"
import { notifTypes } from "../../utils/emailText"
import Notifications from "../notifications"
import { todayUnixEpoch, sendToServerEmail, sendToIssuerEmail } from "../../utils/misc"
import { typeOfRegistrationtoRFP } from "../../utils/constants"

const RegisterBidder = ({
  t,
  t_companies,
  lang,
  rfpRecord,
  companyId,
  companyIssuer, // current signed-on company email
  inviteContest,
  address,
  i18n,
  setNoticeOff,
}) => {
  const { bidders, getBidders, companies } = useBidders();

  // same address could have different case but are the same address, that's why we check like this the address vs bidders array
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [rfpOwner, setrfpOwner] = useState(companyId === rfpRecord.companyId)
  const [guestCompanies, setGuestCompanies] = useState([])
  const [results, setResults] = useState([])
  const [error, setError] = useState(false)
  // Next  is for SearchDB component & make Spinner spin when searching
  const [IsWaiting, setIsWaiting] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [droppedTx, setDroppedTx] = useState()
  const [showModalNotifications, setShowModalNotifications] = useState(false)
  const [showWarningNotEmail, setShowWarningNotEmail] = useState(false)
  const [compWithoutEmail,setCompWithoutEmail ] = useState([])
  const [typeOfNotification, setTypeOfNotification] = useState()
  const [notifying, setNotifying] = useState(false)
  const cleanSearchParams = useRef()

  //********************** nueva estructura/
  // processingTxBlockchain flag to control when TX was send: it shows cancel transaction button on ShowTxSummary
  const [processingTxBlockchain, setProTxBlockchain] = useState(false);
  const [actionButtonClicked, setButtonClicked] = useState(false);

  //****************************** */

  const companyActions = [
    {
      id: 1,
      iconAction: "📍",
      titleAction: "Invite",
      callBack: handleAddGuestCompanytoList,
      width: "[5%]",
    },
  ];

  // Hooks   ******************************************************************************** */
  const { write, postedHash, block, link, blockchainsuccess } = useRegisterBidders(onError, onSuccess, isCancelled, setProTxBlockchain)

  useEffect(() => {
    getBidders(rfpRecord.rfpIndex)
  }, []);

  useEffect(() => {
    if (bidders)
      setAlreadyRegistered(-1 !==bidders.findIndex((element) => {
            return element.toLowerCase() === address.toLowerCase();
          })
      );
  }, [bidders, address]);

  useEffect(() => {
    if (error.message) errToasterBox(error.message);
  }, [error]);

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    setButtonClicked(false);
    toast.error(msj, toastStyle);
  };

  async function onSuccess (registerType) {
    setButtonClicked(false)
    // sent notification emails to invited companies about this invitation RFP registration
    if (registerType===typeOfRegistrationtoRFP.inviteguests)
          automaticEmailNotification(notifTypes.notif_InvitedCompanyRFP)
        else {
          await automaticEmailIssuerNotification(notifTypes.notif_ToIssuerOpenRFP)
          getBidders(rfpRecord.rfpIndex)
        }
  };


  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    setButtonClicked(false);
    setProTxBlockchain(false);
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
  }

  const checkIncluded = (id) =>  Boolean(guestCompanies.filter((cia) => cia.companyId === id).length);
  
  /** 
   * automaticEmailNotification
   * Sent notifications to companies of Open or Invitation RFPs
   *   It checks guestCompanies array and pulls apart companies with emails registered (recipientList)
   *   from those that don't (CompWithoutList)
   *   Sent emails based on typeofNotification and present a modal with CompWithoutList for the user to manually send notification emails
  */
  const automaticEmailNotification = async (typeOfNotification) => {
    //firt check there are selected companies &  purge email listing from non existant property email (email = undefined or empty)
    const recipientList = []
    const CompWithoutEmail = []
    for (const company of guestCompanies) {
      if (company.email || company.email && company.email.trim() !== '') {
        recipientList.push(company.email)
      } else {
        CompWithoutEmail.push(company.name)
      }
    }
    setNotifying(true)
    const params = {
      recipients: recipientList,
      rfpname: rfpRecord.description,
      rfpid: rfpRecord.rfpIndex.toString(),
      companyid: rfpRecord.companyId,
      rfpDescriptor: rfpRecord.name,
      hostcompany: rfpRecord.companyname,
      lang: lang,
      notiftype: typeOfNotification,
    }
    if (CompWithoutEmail.length) {
      setCompWithoutEmail(CompWithoutEmail)
      setShowWarningNotEmail(true)
    }
    const result = await sendToServerEmail(params)
    setNotifying(false)
    if (result.status)
      toast.success( ` ${recipientList.length} ${t("notif_sent_ok", { ns: "common" }, toastStyleSuccess)}` )
     else   errToasterBox(t("emailerror", { ns: "gralerrors" }));
  };

  // Future option to complete: A notification to issuer of contest when a company register itself to their Open RFP
  const automaticEmailIssuerNotification = async (typeOfNotification) => {
    const result= await getCompanydataDB(rfpRecord.companyId)
    if (result.status) {
      const issuerCompany= result.data 
      const params = {
        recipient: issuerCompany.email,
        rfpname: rfpRecord.description,
        rfpid: rfpRecord.rfpIndex.toString(),
        companyname: companyIssuer,
        companyid: rfpRecord.companyId,
        hostcompany:issuerCompany.companyname,
        rfpDescriptor: rfpRecord.name,
        lang: lang,
        notiftype: typeOfNotification,
      }
      setNotifying(true)
      const resp = await sendToIssuerEmail(params)
      if (resp.status){
        toast.success( ` ${t("issuer_notified", { ns: "common" }, toastStyleSuccess)}` )
      } 
      setNotifying(false)
    }
  };

  //**************************************  Handlers ************************ */

  function handleAddGuestCompanytoList(company) {
    if (company.address.toLowerCase() === address) {
      errToasterBox(t("canotinvite_self"));
      return;
    }
    if (checkIncluded(company.companyId)) {
      errToasterBox(`${company.companyname} ${t("already_registered")}`);
      return;
    }
    setGuestCompanies((prev) => [
      ...prev,
      {
        companyId: company.companyId,
        name: company.companyname,
        address: company.address,
        email: company.email,
      },
    ]);
  }

  // A notification to registered companies about an RFP through email button that shows  a spinner and saving legend 
  // when  notifying local var is true
  const ButtonAutomaticNotifOpenRFP = ( {notifType}) => 
    (<button
      className="main-btn mr-2"
      onClick={() =>  automaticEmailNotification(notifType)}
      title={t("notify_email_button", { ns: "common" })}
      disabled={notifying || !Boolean(guestCompanies.length)}
    >
      {notifying ?
        <div className=" flex justify-evenly items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900"></div>
          <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
        </div>
        :
        `${t("send_email", { ns: "common" })}`
        }
    </button>
    );
  

  const handleRemoveCompany = (companyId) => {
    setGuestCompanies(
      guestCompanies.filter((company) => companyId !== company.companyId)
    );
  };

  const handleClosePanel = () => {
    setProTxBlockchain(false);

    // setShowPanel(false);
    setGuestCompanies([]);
    if (cleanSearchParams.current) cleanSearchParams.current.resetparams();
  };

  //  handleCancelTx -  TX is taking long, user has click cancel to abort waiting
  // Tx still can go through but we won't wait for it
  const handleCancelTx = () => {
    setIsCancelled(true);
    // create a copy of droppedTx object
    const updatedTxObj = { ...droppedTx };
    // update txLink property with the link value
    updatedTxObj.txHash = postedHash;
    // pass updatedTxObj to setNoticeOff function
    setNoticeOff({ fired: true, txObj: updatedTxObj });
    setProTxBlockchain(false);
  };

  const handleRegisterItself = () => {
    setButtonClicked(true);
    setIsCancelled(false); // in case user is retrying
    const today = todayUnixEpoch(new Date());
    const Tx = {
      type: typeOfRegistrationtoRFP.registeropen,  //"registeropen",
      date: today,
      params: [rfpRecord.rfpIndex, companyId],
    };
    setDroppedTx(Tx);
    write(typeOfRegistrationtoRFP.registeropen, rfpRecord.rfpIndex, companyId);
  };

  // records on blockchain contract the invited companies to this Invitation RFP
  const handleRegisterGuestsInvRFP = async () => {
    setButtonClicked(true);
    setIsCancelled(false); // in case user is retrying
    const addresses = guestCompanies
      .filter((obj) => obj.status !== "fulfilled")
      .map((obj) => obj.address);
    if (addresses.length) {
      const today = todayUnixEpoch(new Date());
      const Tx = {
        type: typeOfRegistrationtoRFP.inviteguests, //"inviteguests"
        date: today,
        params: [rfpRecord.rfpIndex, companyId, addresses],
      };
      setDroppedTx(Tx);
      write(typeOfRegistrationtoRFP.inviteguests, rfpRecord.rfpIndex, companyId, addresses);
    } else {
      setProTxBlockchain(false);
      errToasterBox(t("no_companies_invite"));
    }
  };

  // // Show Notifications modal to notify non-registered companies of an Invitation RFP
  // const handleNotifnoRegCompaniesInvRFP = async () => {
  //   setTypeOfNotification(notifTypes.notif_noRegCompanyInvRFP);
  //   setShowModalNotifications(true);
  // };

  // Show Notifications modal to notify non-registered companies of an Open RFP
  const handleNotifnoRegCompaniesToRFP = async (notifType) => {
    setTypeOfNotification(notifType);
    setShowModalNotifications(true);
  };



  /***********************************************  Inner Components ************************************* */
  const InvitedCompanies = () => {
    return (
      <div className="h-[25em] overflow-y-auto p-2">
        <div className="pb-2 flex justify-center font-khula text-stone-900">
          <p>{t("inviting_companies_title")}</p>
        </div>
        <table className="p-2 w-full h-[5em]  table-fixed border-2 border-orange-300  font-khula">
          <thead>
            <tr className=" border-2 border-orange-500  text-stone-500 ">
              <th className="pt-1 w-1/6 border-r-2 border-orange-500  break-words">
                {t("remove_guest")}
              </th>
              <th className="pt-1 w-1/3 border-r-2 border-orange-500 break-words">
                {t("id_guest")}
              </th>
              <th className="pt-1 w-2/3 break-words">{t("company_guest")}</th>
            </tr>
          </thead>
          <tbody>
            {guestCompanies.map((company) => (
              <tr
                key={nanoid()}
                className="even:bg-slate-200 odd:bg-orange-100 text-stone-600"
              >
                <td
                  onClick={() => handleRemoveCompany(company.companyId)}
                  className="text-center cursor-pointer"
                >
                  ⛔
                </td>
                <td className="p-1 border-r-2 border-white truncate">
                  {company.companyId}
                </td>
                <td className="p-1 truncate"> {company.name} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Button to allow a company to register guests to the Invitation RFP and notify new companies of this Invitation RFP
  const ButtonsRegisterGuestsInvRFP = () => (
      <button
        className="main-btn mr-2"
        onClick={handleRegisterGuestsInvRFP}
        title={t("register_gueststo_rfp")}
        disabled={processingTxBlockchain || actionButtonClicked || !Boolean(guestCompanies.length)}
      >
        {t("register_gueststo_rfp")}
      </button>
  );

  // Button to allow a company to register itself to the Open RFP
  const ButtonsRegistertoOpen = () => (
      <button
        className="main-btn ml-2"
        onClick={handleRegisterItself}
        disabled={processingTxBlockchain || actionButtonClicked}
      >
        {t("registerto_rfp")}
      </button>
  );

  /**
   * ButtonnoRegNotifRFP
   *  Button to notify non registered companies of an RFP   // 
   *  It opens a modal to add manually emails and allow sending through Propon.me server email or prepare a email in 
   * client local email client. 
   * There isn't much validation if such client exists or what hapens after it invokes local client because there is not capacities at browser
**/ 
  const ButtonnoRegNotifRFP = ({notifType}) => (
    <div className="">
      <button
        className="main-btn ml-2 "
        onClick={() => handleNotifnoRegCompaniesToRFP(notifType)
        }
        title={t("notify_tooltip", { ns: "common" })}
      > {t("notify_new_companies", { ns: "common" })} </button>
    </div>
  );

  const MainInstructions = () => {
    if (inviteContest && rfpOwner) 
        return t("register_guest")     // if not owner (rfpOwner is false) doesn't matter as it wont get up here as it's dispatched on parent component (homerfp.jsx)
    if (!inviteContest && rfpOwner)    // if is and Open RFP and its the RFP owner
      return t("notify_open_non_reg")  // Display Notice to select companies for notifying component 
    else if (!alreadyRegistered)
         return t("register_open")     // Display Notice to registered compamy for self-registering to open RFP 
        else return <GralMsg title={t("participant_rfp")} />
  };

  const WarnNotEmail = () => 
    <div className="p-4 font-khula text-base text-stone-800">
      <div className="flex items-center">
        <Image alt="Info" className="text-orange-800" src="/information.svg" height={22} width={22}/>
        <p className="ml-2 mt-1  text-gray-600 text-extrabold text-base ">
            <strong>{t('companies_without_email',{ns:"common"})} </strong>
        </p>
      </div>
      
      <ul className="ml-8 mt-4 pl-4 list-circle">
        {compWithoutEmail.map((company) => 
          <li key={nanoid()} >
            {company}
          </li>
        )}
      </ul>
    </div>
  
  /************************* MAIN JSX ******************************************************** */
  return (
    <div className="p-1">
      {showModalNotifications && (
        <ModalWindow
          setFlag={setShowModalNotifications}
          closeLabel={t("close", { ns: "common" })}
        >
          <Notifications
            t={t}
            rfpRecord={rfpRecord}
            notiftype={typeOfNotification}
            lang={lang}
          />
        </ModalWindow>
      )}
      {showWarningNotEmail &&
          <ModalWindow
            setFlag={setShowWarningNotEmail}
            closeLabel={t("close", { ns: "common" })}
          >
          {WarnNotEmail()}
          </ModalWindow>
        }
      <div className="mt-4  border-2 border-stone-300 shadow-lg ">
        <p className="text-stone-600 p-4 ">
          <MainInstructions />
        </p>
        <div className="m-2 p-2">
          {rfpOwner && (
            <>
              <div className=" my-2 flex">
                <>
                  <div
                    id="owner-rfp-invitation"
                    className="shadow w-3/5 h-[25em] outline-1 border border-orange-500 rounded-lg overflow-hidden"
                  >
                    <SearchDB
                      i18n={i18n}
                      fields={companyFields}
                      path={`/api/servercompanies?`}
                      setResults={setResults}
                      setWait={setIsWaiting}
                      setError={setError}
                      t={t_companies}
                      ref={cleanSearchParams}
                    />
                    {IsWaiting ? (
                      <div className="mt-12 mb-4 scale-75">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="mt-8 w-full">
                        {results.length > 0 ? (
                          <DisplayResults
                            fields={companyFields}
                            results={results}
                            actions={companyActions}
                            t={t}
                          />
                        ) : (
                          <div className="bg-orange-100 p-4 text-red-600 text-xl text-center">
                            {t("noresults", { ns: "common" })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div id="companiestoinvite" className="ml-2 w-2/5  ">
                    <div className="shadow outline-1 border border-orange-500 rounded-lg">
                      <InvitedCompanies />
                    </div>
                  </div>
                </>
              </div>
            </>
          )}
          {inviteContest ? (
            // show buttons for Invitation RFP: record guest to contract and notify new companies (no registered)
            <div className="mt-4 mb-4 flex  p-4 justify-center items-center">
              <ButtonsRegisterGuestsInvRFP />
              <ButtonnoRegNotifRFP notifType={notifTypes.notif_noRegCompanyInvRFP} />
            </div>
          ) : rfpOwner ? (
            // is an open RFP and its the RFP owner so show buttons to notify selected companies or notify new companies
            <div className="mt-2 mb-4 flex  p-4 justify-center items-center">
              <ButtonAutomaticNotifOpenRFP notifType={notifTypes.notif_RegCompanyOpenRFP} />
              <ButtonnoRegNotifRFP notifType={notifTypes.notif_noRegCompanyOpenRFP} />
              </div>
          ) : (
            <div className="mt-2 mb-4 flex  p-4 justify-center items-center">
              {!alreadyRegistered && <ButtonsRegistertoOpen />}
            </div>

          )}
          {processingTxBlockchain && (
            <div
              id="showsummary"
              className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50"
            >
              <div className="fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
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
        </div>
      </div>
    </div>
  );


};
export default RegisterBidder;
  