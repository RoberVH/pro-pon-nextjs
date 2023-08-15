/**
 * HomeRFP
 *      Page to interact wuth an RPF
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, lazy, Suspense, useContext } from "react";
//import ReactDOM from 'react-dom';
import { ethers } from 'ethers'
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const { BigNumber } = require("ethers");
const RFPDocuments = lazy(() => import("../components/rfp/rfpDocuments"));
const RegisterBidder = lazy(() => import("../components/rfp/registerBidder"));
const ShowBidders = lazy(() => import("../components/rfp/showBidders"));
const ShowResults = lazy(() => import("../components/rfp/showResults"));
const DeclareResults = lazy(() => import("../components/rfp/declareResults"));
import DismissedTxNotice from "../components/layouts/dismissedTxNotice";
//const DisplayItems = lazy(() => import("../components/rfp/displayItems"));

import RFPIdentificator from "../components/rfp/rfpIdentificator";
import RFPessentialData from "../components/rfp/RFPessentialData";

import { parseWeb3Error } from "../utils/parseWeb3Error";
import DisplayItems from "../components/rfp/displayItems";
import GralMsg from "../components/layouts/gralMsg";
import NoItemsTitle from "../components/layouts/NoItemsTitle";
import { proponContext } from "../utils/pro-poncontext";
import HomeButtons from "../components/rfp/homeButtons";
import Spinner from "../components/layouts/Spinner";
import { getContractRFP } from "../web3/getContractRFP";
import { getContractRFPFromServer } from "../web3/getContractRFPFromServer";
import { savePendingTx } from "../database/dbOperations";
import { toastStyle, toastStyleSuccess } from "../styles/toastStyle";
import { toast } from "react-toastify";

import { docTypes, openContest, inviteContest } from "../utils/constants";

function HomeRFP() {
  const displayedPanels = [
    "rfp_bases", // show /allow owner to post requesting documents
    "bidder_register", // allow participant to register and upload bids
    "bidders_showcase", // show companies registered and their posted (encrypted) documents
    "declare_contest", // allow owner to close RFP declaring desert / winner by items or at all
    "rfp_results", // if contest closed, only this is valid showing results
  ];

  const [rfpRecord, setRfpRecord] = useState(undefined)
  const [selectedPanel, setSelectedPanel] = useState()
  const [loading, setloading] = useState(true)
  const [noRFP, setNoRFP] = useState(false)
  const [noConnectedWalletRFP, setNotConWallet] = useState(false)   // this signals THERE IS a wallet but no account connected to Propon
  const [noticeOff, setNoticeOff] = useState({ fired: false, tx: null })
  const { companyData, address } = useContext(proponContext)
  const router = useRouter()
  const { t } = useTranslation(["rfps","gralerrors"])
  const t_companies = useTranslation("companies").t; // tp search for companies when inviting them
  const { companyId, companyname, rfpidx } = router.query;

  //Next line  because we'll need to be able to search for Companies when inviting them to contest
  // this is because deep in the hierarchy, there is a control to search countries that is displayed in the selected language
  // this selection is programatically asigned according to current language , that is got from i18n.language property
  // the control that uses is InputCountrySel.jsx
  // future versions could have this setting in the context
  const { i18n } = useTranslation("companies");

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  //  Hooks ******************************************************************

  //save to DB pending Transactions
  useEffect(() => {
    const saveDBPendingTx = async () => {
      if (noticeOff.fired) {
        const result = await savePendingTx({...noticeOff.txObj, sender:companyData.address})   // Pass the object and add who issued the Tx
        if (!result.status) {
          const msgErr=parseWeb3Error(t,{message:result.msg})
          errToasterBox(msgErr)
        } else {
          // notify Tx was saved
          toast.success(t('pendingtxsaved'))
        }
      }
    };
    saveDBPendingTx();
  }, [noticeOff.fired]);

  // Get RFP record values and  files for this RFP at load component
  useEffect(() => {
    const getRFP = async () => {
      if (!rfpidx) return;
      let result;
      if (window.ethereum ) {
          if (window.ethereum.selectedAddress === null) {
              try {
                // MetaMask is not connected, request access
                await window.ethereum.enable();      
                result = await getContractRFP(rfpidx)
              } catch (error) {
                  const customError = parseWeb3Error(t, error);
                  errToasterBox(customError)
                  setNotConWallet(true)
                  setloading(false)
                }
          } else result = await getContractRFP(rfpidx)
      } else {
        result = await getContractRFPFromServer(rfpidx)
      }
      if (!result) {
          setloading(false)
          return
      }
      if (!result.status) {
        const errMsg=parseWeb3Error(t,result)
        errToasterBox(errMsg);
        setNoRFP(true);
        return;
      }
      const RFP = { companyId: companyId, companyname: companyname };
      //  remove redundant numeric properties ([0]: ... [N]) from contract response & convert from Big number to
      //  number at the same time
      // Remeber that converting to flat object in the server could have made it lost BigNumber type so to be safe
      // we check for explicit type on object
      for (const prop in result.RFP) {
        if (isNaN(parseInt(prop))) {
          if (result.RFP[prop].type === 'BigNumber') {
            const bigNumber = ethers.BigNumber.from(result.RFP[prop].hex);
            RFP[prop] = bigNumber.toNumber();
          }
          else RFP[prop] = result.RFP[prop];
        }
      }
      setRfpRecord(RFP);
    };
    getRFP();
    setloading(false);
  }, [companyId, companyname, rfpidx]);

  //  Inner Components ******************************************************************
  
  const RFPTabDisplayer = () => {
    switch (selectedPanel) {
      case "rfp_bases": // rfp_bases RFP's Issuer Load/download component
        return (
          <RFPDocuments
            t={t}
            showUpload={companyData.companyId === rfpRecord.companyId}
            rfpIndex={rfpRecord.rfpIndex}
            rfpDates={[
              rfpRecord.openDate,
              rfpRecord.endReceivingDate,
              rfpRecord.endDate,
            ]}
            owner={rfpRecord.issuer}
            setNoticeOff={setNoticeOff}
          />
        );
      case "bidder_register": //bidder_register  only for Open Contests
        if (!address || !Boolean(companyData.companyId))
          return <GralMsg title={t("not_registered")} />  // not registered company is logged 
        if (!!address && rfpRecord.participants.some(participant => participant.toLowerCase() === address.toLowerCase())) 
            return <GralMsg title={t("participant_rfp")} /> // a participating company is logged 
        if (
          Number(rfpRecord.contestType) === inviteContest &&
          companyData.companyId !== rfpRecord.companyId
        )  return <GralMsg title={t("invitation_rfp")} /> // a not participating company is logged

        /*********************Comentado para agregar notif a empresas ************************************************************ */
        // if (
        //   Number(rfpRecord.contestType) === openContest &&
        //   companyData.companyId === rfpRecord.companyId
        // )
        //   // Open contest and address it's owner's
        //   return <GralMsg title={t("owner_open_rfp_recordbidders")} />;
        /***************************************************************************************************************************** */
        
        // all ok, show Register component
        return (
          <RegisterBidder
            t={t}
            t_companies={t_companies}
            lang={i18n.language}
            rfpRecord={rfpRecord}
            companyId={companyData.companyId}
            companyIssuer={companyData.companyname}
            inviteContest={Number(rfpRecord.contestType) === inviteContest}
            address={address}
            i18n={i18n} // This is because SearchDB needs it to be able to search for Companies
            setNoticeOff={setNoticeOff}
          />
        );
      case "bidders_showcase": //bidders_showcase
        return (
          <ShowBidders
            t={t}
            docType={docTypes[0]}
            address={address}
            rfpIndex={rfpRecord.rfpIndex}
            owner={rfpRecord.issuer}
            rfpDates={[
              rfpRecord.openDate,
              rfpRecord.endReceivingDate,
              rfpRecord.endDate,
            ]}
            setNoticeOff={setNoticeOff}
          />
        );
      case "declare_contest": //declare_contest
        if (
          !Boolean(companyData?.address) ||
          companyData.address.toLowerCase() !== rfpRecord.issuer.toLowerCase()
            )
            return <GralMsg title={t("no_issuer_rfp")} />; // not owner of RFP
        return <DeclareResults 
                    t={t} 
                    rfpIndex={rfpRecord.rfpIndex} 
                    setNoticeOff={setNoticeOff}
                    companyId={companyData.companyId}/>;
        break;
      case "rfp_results": //rfp_results
        return <ShowResults 
                    t={t} 
                    rfpIndex={rfpRecord.rfpIndex} />;
      default:
        return <GralMsg title={t("select_tab")} />;
    }
  };

  //********************* MAIN JSX ******************** */

  if (!loading && noConnectedWalletRFP)
    return <NoItemsTitle msg={t("no_connected_wallet").toUpperCase()} />;
  if (!loading && noRFP)
    return <NoItemsTitle msg={t("no_rfp").toUpperCase()} />;
  if (!noRFP && rfpRecord)
    return (
      <div>
        {noticeOff.fired && (
          <div className="fixed inset-0 bg-transparent z-50">
            <div  className="fixed top-[30%] left-[40%] ">
              <DismissedTxNotice
                notification={t("dropped_tx_notice")}
                buttonText={"accept"}
                setNoticeOff={setNoticeOff}
                dropTx={noticeOff.txObj}
                typeTx = {t(`transactions.${noticeOff.txObj.type}`)}
              />
              </div>
            </div>
        )}
        <div className="outline outline-1 outline-orange-200 bg-white border-b-8 border-orange-200 border-double">
          <RFPIdentificator t={t} rfpRecord={rfpRecord} />
        </div>
        <div id="homerfp-subpanel" className="grid grid-cols-[25%_74%] gap-1 ">
          <div
            id="homeref-lateral-panel"
            className=" border-r-8 border-double border-orange-200 "
          >
            <div id="left-subpanel" className="mt-2">
              <div className="shadow-md">
                <RFPessentialData t={t} rfpRecord={rfpRecord} />
              </div>
              {rfpRecord?.items && Boolean(rfpRecord.items.length) && (
                <div className="shadow-md ">
                  <DisplayItems items={rfpRecord.items} t={t} />
                </div>
              )}
            </div>
          </div>
          <div id="right-subpanel" className="mt-2 ml-1 ">
            <div
              id="homeref-buttons-panels"
              className="font-khula text-center "
            >
              <HomeButtons
                t={t}
                displayedPanels={displayedPanels}
                selectedPanel={selectedPanel}
                setSelectedPanel={setSelectedPanel}
              />
            </div>
            <div
              id="selected-tab-area"
              className="bg-white border-2 border-orange-300 min-h-screen"
            >
              <div id="selected-usable-area" className="m-2">
                <Suspense
                  fallback={
                    <div className="mt-24">
                      <Spinner />
                    </div>
                  }
                >
                  <RFPTabDisplayer />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  // Conditions aren't settled, meanwhile return Spinner
  return (
    <div className="mt-24">
      <Spinner />
    </div>
  );
}


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "rfps",
        "common",
        "gralerrors",
        "menus",
        "companies",
      ])),
    },
  };
}

export default HomeRFP;
