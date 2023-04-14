/**
 *  RegisterBidder
 *  Component that gets render when dealing with a OPEN contest
 *  it allows a company to register to the Open RFP
 *  it detects and warns in case company is already registered
 *  params: inviteContest - Boolean if false then is an open contest
 */

import { useState, useEffect, useRef } from "react";
import SearchDB from "../SearchDB";
import DisplayResults from "../DisplayResults";
import Spinner from "../layouts/Spinner";
import { companyFields } from "../../utils/companyFieldsonRFP";
import { nanoid } from "nanoid";

// toastify related imports
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import { useRegisterBidders } from "../../hooks/useRegisterBidders";
import { useBidders } from '../../hooks/useBidders'
import ShowTXSummary from "./ShowTXSummary";
import { parseWeb3Error } from "../../utils/parseWeb3Error";
import SpinnerBar from "../layouts/SpinnerBar"
import { serializeArray } from '../../utils/serialArrays'
import { todayUnixEpoch } from "../../utils/misc";

const RegisterBidder = ({
  t,
  t_companies,
  rfpRecord,
  companyId,
  inviteContest,
  address,
  i18n,
  setNoticeOff
}) => {
  const { bidders, getBidders, companies } = useBidders(rfpRecord.rfpIndex);

   // same address could have different case but are the same address, that's why we check like this the address vs bidders array 
   const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [rfpOwner, setrfpOwner] = useState(companyId === rfpRecord.companyId)
  const [guestCompanies, setGuestCompanies] = useState([])
  const [results, setResults] = useState([])
  const [error, setError] = useState(false)
  // Next  is for SearchDB component & make Spinner spin when searching
  const [IsWaiting, setIsWaiting] = useState(false)
  const [sendingBlockchain, setsendingBlockchain] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false);
  const [droppedTx, setDroppedTx] = useState()  
  const cleanSearchParams = useRef()

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
  useEffect(()=>{
    getBidders(rfpRecord.rfpIndex)
  },[])

useEffect(()=>{
  if (bidders) 
      setAlreadyRegistered((-1!==bidders.findIndex(element => {
          return element.toLowerCase() === address.toLowerCase();
      })))
},[bidders, address])

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
  
  const onSuccess = () => {
    setsendingBlockchain(false);
  };

  const { write, postedHash, block, link, blockchainsuccess } = useRegisterBidders(onError, onSuccess, isCancelled);
  
  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    // setUploading(false);
    setsendingBlockchain(false);
  }

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
      },
    ]);
  }

  
  const handleRemoveCompany = (companyId) => {
    setGuestCompanies(guestCompanies.filter((company) => companyId !== company.companyId));
  };
  
  
  const handleClosePanel = () => {
    setShowPanel(false);
    setGuestCompanies([]);
    if (cleanSearchParams.current) cleanSearchParams.current.resetparams()
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
    setsendingBlockchain(false)
    setShowPanel(false)
  }

  const handleRegisterItself = () => {
    setShowPanel(true);
    setsendingBlockchain(true)
    const today = todayUnixEpoch(new Date())
    const Tx = {type: 'registeropen', date: today, params: [rfpRecord.rfpIndex, companyId]}
    setDroppedTx(Tx)
    write("registeropen", rfpRecord.rfpIndex, companyId);
  };

  const handleRegisterGuests = async () => {
    setIsCancelled(false)
    const addresses = guestCompanies
      .filter((obj) => obj.status !== "fulfilled")
      .map((obj) => obj.address);
    const notRetrieved = guestCompanies
      .filter((obj) => obj.status === "fulfilled")
      .map((obj) => obj.name);
    if (addresses.length) {
      setShowPanel(true);
      setsendingBlockchain(true)
      const today = todayUnixEpoch(new Date())
      const Tx = {type: 'inviteguests', date: today, params: [rfpRecord.rfpIndex, companyId, addresses]}
      setDroppedTx(Tx)
      write("inviteguests", rfpRecord.rfpIndex, companyId, addresses);
    }
  };
  

  const checkIncluded = (id) =>
    Boolean(guestCompanies.filter((cia) => cia.companyId === id).length);

  const InvitedCompanies = () => {
    return (
      <div className="h-[25em] overflow-y-auto p-2">
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

  const ButtonsRegisterGuests = (
    <div className="mt-2 mb-2 flex  pt-4 pl-4 pr-4  justify-center items-center">
      <button className="main-btn" onClick={handleRegisterGuests}>
        {!sendingBlockchain ? 
              `${t("register_gueststo_rfp")}` 
              : 
              <div className=" flex justify-evenly items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900">
                </div>
                <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
              </div>
        }
      </button>
      {(link && !blockchainsuccess) &&
        <button onClick={handleCancelTx} className="main-btn ml-16">{t("cancelbutton")}</button>
      }
    </div>
  );

  const ButtonsRegistertoOpen = (
    <div className="mt-2 mb-4 flex  p-4 justify-center items-center">
      <button className="main-btn" onClick={handleRegisterItself}>
        {!sendingBlockchain ? 
            `${t("registerto_rfp")}` 
            : 
            <div className=" flex justify-evenly items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900">
              </div>
              <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
            </div>
        }
      </button>
      {(link && !blockchainsuccess) &&
        <button onClick={handleCancelTx}  className="main-btn ml-16">{t("cancelbutton")}</button>
      }
    </div>
  );

  return (
    <div className="p-1">

      <div className="mt-4  border-2 border-stone-300 shadow-lg ">
        <p className="text-stone-600 p-4 ">
          {rfpOwner ? t("register_guest") : t("register_open")}
        </p>
        <div className="m-2 p-2">
          {inviteContest && (
            <>
              <div className=" my-2 flex">
                <>
                  <div
                    id="owner-rfp-invitation"
                    className="shadow w-3/5 h-[25em] outline-1 border border-orange-500 rounded-lg"
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
                  <div className="ml-2 w-2/5  ">
                    <div className="shadow outline-1 border border-orange-500 rounded-lg">
                      <InvitedCompanies />
                    </div>
                  </div>
                </>
              </div>
              {ButtonsRegisterGuests}
            </>
          )}
          {/* Here goes blockchain Tx status informative panel */}
          {!inviteContest && (
            <>
              <div>{ButtonsRegistertoOpen}</div>
            </>
          )}
          {showPanel && (
            <div className="mt-4 py-1 bg-white border rounded-md border-orange-300 border-solid shadow-xl  mb-2">
              <div className="font-khula text-base py-4 pl-2">
                <ShowTXSummary
                  postedHash={postedHash}
                  link={link}
                  block={block}
                  t={t}
                  handleClosePanel={handleClosePanel}
                />
              </div>
              { sendingBlockchain &&
              <div className="mb-4 ">
                <SpinnerBar msg={t('loading_data')} />
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RegisterBidder;
