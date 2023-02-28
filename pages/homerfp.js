/**
 * HomeRFP
 *      Page to interact wuth an RPF
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, useCallback, useContext, Fragment } from "react";
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const { BigNumber } = require("ethers");
import RFPIdentificator from "../components/rfp/rfpIdentificator";
import RFPessentialData from "../components/rfp/RFPessentialData";
import RFPDocuments from "../components/rfp/rfpDocuments";
import RegisterBidder from "../components/rfp/registerBidder";
import ShowBidders from "../components/rfp/showBidders";
import ShowResults from "../components/rfp/showResults";
import DeclareResults from "../components/rfp/declareResults";
import DisplayItems from "../components/rfp/displayItems";
import GralMsg from "../components/layouts/gralMsg";
import NoItemsTitle from "../components/layouts/NoItemsTitle";
import { proponContext } from "../utils/pro-poncontext";
import HomeButtons from "../components/rfp/homeButtons";
import Spinner from "../components/layouts/Spinner";
import { getContractRFP } from '../web3/getContractRFP'
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

  const [rfpRecord, setRfpRecord] = useState(undefined);
  const [selectedPanel, setSelectedPanel] = useState();
  const [loading, setloading] = useState(true)
  const [noRFP, setNoRFP] = useState(false)

  const { companyData, address } = useContext(proponContext);
  const router = useRouter()
  const { t } = useTranslation("rfps");
  const t_companies = useTranslation("companies").t; // tp search for companies when inviting them
  const { companyId, companyname, rfpidx } = router.query;


  //Next line  because we'll need to be able to search for Companies when inviting them to contest
  const { i18n } = useTranslation("companies");

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

//  Inner Components ******************************************************************

  // Get RFP record values and  files for this RFP at load component
  useEffect(() => {
    const getRFP = async () => {
      if (!rfpidx) return
      const result= await getContractRFP(rfpidx)
      if (! result.status){ 
        errToasterBox(result.message)
        setNoRFP(true)
        return
      } 
      const RFP = {companyId: companyId, companyname: companyname}
      //  remove redundant numeric properties ([0]: ... [N]) from contract response & convert from Big number to 
      //  number at the same time
      for (const prop in result.RFP) {
        if (isNaN(parseInt(prop))) {
          if ((result.RFP[prop] instanceof BigNumber))
            RFP[prop] = result.RFP[prop].toNumber()
          else
            RFP[prop] = result.RFP[prop];
        }
      }
      setRfpRecord(RFP);
    };
    getRFP();
    setloading(false)
  }, [companyId, companyname, rfpidx]);


const RFPTabDisplayer = () => {
  switch (selectedPanel) {
    case 'rfp_bases':
        return (
          <RFPDocuments
            t={t}
            showUpload={companyData.companyId === rfpRecord.companyId}
            rfpIndex={rfpRecord.rfpIndex}
            rfpDates={[rfpRecord.openDate,rfpRecord.endDate]}
            owner={rfpRecord.issuer}
          />
        );
    case 'bidder_register': //bidder_register  only for Open Contests
        if (!address || !Boolean(companyData.companyId))
          return <GralMsg title={t("not_registered")} />;
        if (Number(rfpRecord.contestType) === inviteContest &&companyData.companyId !== rfpRecord.companyId)
            return <GralMsg title={t("invitation_rfp")} />;
        if (Number(rfpRecord.contestType) === openContest &&companyData.companyId === rfpRecord.companyId)
            // Open contest and address it's owner's
            return <GralMsg title={t("owner_open_rfp_recordbidders")} />;
        // all ok, show Register component
        return (
          <RegisterBidder
              t={t}
              t_companies={t_companies}
              rfpRecord={rfpRecord}
              companyId={companyData.companyId}
              inviteContest={Number(rfpRecord.contestType) === inviteContest}
              address={address}
              i18n={i18n} // This is because SearchDB needs it to be able to search for Companies
          />
          );
    case 'bidders_showcase': //bidders_showcase
        return (
          <ShowBidders
            t={t}
            docType={docTypes[0]}
            address={address}
            rfpIndex={rfpRecord.rfpIndex}
            owner={rfpRecord.issuer}
            rfpDates={[rfpRecord.openDate,rfpRecord.endReceivingDate]}
          />
        );
    case 'declare_contest': //declare_contest
    if (!Boolean(companyData?.address) || (companyData.address.toLowerCase() !== rfpRecord.issuer.toLowerCase())) 
        return ( <GralMsg title={t('no_issuer_rfp')}/>)     // not owner of RFP
    return (
            <DeclareResults 
              t={t}
              rfpRecord={rfpRecord}
              />
           )
        break;
    case 'rfp_results': //rfp_results
        return (
            <ShowResults 
              t={t}
              rfpRecord={rfpRecord}
            />
          )
    default:
        return <GralMsg title={t('select_tab')}/>;
  }
};

        
  if (!loading && noRFP) return <NoItemsTitle msg={t('no_rfp').toUpperCase()} />  
  
  if (!noRFP && rfpRecord)  return (
    <div>
      <div className="outline outline-1 outline-orange-200 bg-white border-b-8 border-orange-200 border-double">
        <RFPIdentificator 
          t={t} 
          rfpRecord={rfpRecord} 
      />
      </div>
      <div id="homerfp-subpanel" className="grid grid-cols-[25%_74%] gap-1 ">
        <div
          id="homeref-lateral-panel"
          className=" border-r-8 border-double border-orange-200 "
        >
          <div id="left-subpanel" className="mt-2">
            <div className="shadow-md">
              <RFPessentialData
                t={t}
                rfpRecord={rfpRecord}
              />
            </div>
            {rfpRecord?.items && Boolean(rfpRecord.items.length) && (
              <div className="shadow-md ">
                <DisplayItems items={rfpRecord.items} t={t} />
              </div>
            )}
          </div>
        </div>
        <div id="right-subpanel" className="mt-2 ml-1 ">
          <div id="homeref-buttons-panels" className="font-khula text-center ">
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
              <RFPTabDisplayer />
            </div>
          </div>
        </div>
        <div></div>

        <div></div>
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

// Get language translation json files  and the rfpId params at url to present it on this page
// export async function getServerSideProps({ locale, query }) {
//   //getStaticProps
//   // get documents registered to this RFP here

//   return {
//     props: {
//       query: query,
//       ...(await serverSideTranslations(locale, [
//         "rfps",
//         "common",
//         "gralerrors",
//         "menus",
//         "companies",
//       ])),
//       // Will be passed to the page component as props
//     },
//   };
// }

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