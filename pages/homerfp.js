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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RFPIdentificator from "../components/rfp/rfpIdentificator";
import RFPessentialData from "../components/rfp/RFPessentialData";
import RFPDocuments from "../components/rfp/rfpDocuments";
import RegisterBidder from "../components/rfp/registerBidder";
import ShowBidders from "../components/rfp/showBidders";
import ShowResults from "../components/rfp/showResults";
import DeclareResults from "../components/rfp/declareResults";
import DisplayItems from "../components/rfp/displayItems";
import { useFilesRFP } from "../hooks/useFilesRFP";
import { proponContext } from "../utils/pro-poncontext";
import HomeButtons from "../components/rfp/homeButtons";
import { getArweaveFilesMetadata } from "../web3/getArweaveFilesMetadata";
import { toastStyle, toastStyleSuccess } from "../styles/toastStyle";
import { toast } from "react-toastify";

import { useBidders } from "../hooks/useBidders";
import { docTypes, openContest, inviteContest } from "../utils/constants";

function HomeRFP({ query }) {
  const displayedPanels = [
    "rfp_bases", // show /allow owner to post requesting documents
    "bidder_register", // allow participant to register and upload bids
    "bidders_showcase", // show companies registered and their posted (encrypted) documents
    "declare_contest", // allow owner to close RFP declaring desert / winner by items or at all
    "rfp_results", // if contest closed, only this is valid showing results
  ];

  const [rfpRecord, setRfpRecord] = useState();
  const [selectedPanel, setSelectedPanel] = useState();
  //const [guests, setGuests] = useState([]); // list of companies registered to this contest

  const { companyData, address } = useContext(proponContext);
  const { t } = useTranslation("rfps");
  const t_companies = useTranslation("companies").t; // tp search for companies when inviting them

  //Next line  because we'll need to be able to search for Companies when inviting them to contest
  const { i18n } = useTranslation("companies");
  //const { newfiles, setNewFiles, rfpfiles, setRFPFiles, updateRFPFilesArray } = useFilesRFP(rfpRecord);
  const { setNewFiles, rfpfiles, updateRFPFilesArray } = useFilesRFP(rfpRecord);
  const { bidders, getBidders, companies } = useBidders(rfpRecord);

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const GralMsg = ({ title }) => (
    <div className="p-4">
      <div
        className="mt-4 w-2/3 min-w-full h-[9rem] min-h-full border-2 border-coal-500 
            flex shadow-lg p-4 justify-center items-center tracking-wide text-stone-500 uppercase"
      >
        {title}
      </div>
    </div>
  );

  // Get files for this RFP at load component
  useEffect(() => {
    const getRFP = () => {
      setRfpRecord(query);
      updateRFPFilesArray();
    };
    getRFP();
  }, [query, updateRFPFilesArray]);

  // Get bidders for this RFP at load component
  useEffect(() => {
    async function retrieveBidders() {
      if (rfpRecord?.rfpidx) {
        const res = getBidders();
        if (!res.status) errToasterBox(res.message);
      }
    }
    retrieveBidders();
  }, [getBidders, rfpRecord]);

  const RFPTabDisplayer = () => {
    switch (selectedPanel) {
      case displayedPanels[0]: //rfp_bases
        return (
          <RFPDocuments
            t={t}
            rfpfiles={rfpfiles}
            setNewFiles={setNewFiles}
            showUpload={companyData.companyId === rfpRecord.companyId}
            rfpId={rfpRecord._id}
            rfpIndex={rfpRecord.rfpidx}
            docType={docTypes[0]}
            owner={rfpRecord.owneraddress}
          />
        );
      case displayedPanels[1]: //bidder_register  only for Open Contests
        if (!address || !Boolean(companyData.companyId))
          return <GralMsg title={t("not_registered")} />;
        if (
          Number(rfpRecord.contestType) === inviteContest &&
          companyData.companyId !== rfpRecord.companyId
        )
          return <GralMsg title={t("invitation_rfp")} />;
        if (
          Number(rfpRecord.contestType) === openContest &&
          companyData.companyId === rfpRecord.companyId
        )
          // Open contest and address it's owner's
          return <GralMsg title={t("owner_open_rfp_recordbidders")} />;
        // all ok, show Register component
        if (bidders)
          return (
            <RegisterBidder
              bidders={bidders}
              t={t}
              t_companies={t_companies}
              rfpRecord={rfpRecord}
              companyId={companyData.companyId}
              getBidders={getBidders}
              inviteContest={Number(rfpRecord.contestType) === inviteContest}
              address={address}
              i18n={i18n} // This is because SearchDB needs it to be able to search for Companies
            />
          );
        else return null;
      case displayedPanels[2]: //bidders_showcase
        return (
          <ShowBidders
            t={t}
            setNewFiles={setNewFiles}
            rfpId={rfpRecord._id}
            docType={docTypes[0]}
            address={address}
            companies={companies}
            rfpfiles={rfpfiles}
            owner={rfpRecord.owneraddress}
          />
        );
      case displayedPanels[3]: //declare_contest
        if (address === rfpRecord.owner) return <DeclareResults />;
        else return null;
        break;
      case displayedPanels[4]: //rfp_results
        return <ShowResults />;
      default:
        return <div>default</div>;
    }
  };

  const handleDeclareWinner = () => {};
  if (!rfpRecord) return <div>No RFP</div>;
  return (
    <Fragment>
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
              <RFPessentialData
                t={t}
                rfpRecord={rfpRecord}
                handleDeclareWinner={handleDeclareWinner}
              />
            </div>
            {rfpRecord.items && rfpRecord.items.length && (
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
    </Fragment>
  );
}

// Get language translation json files  and the rfpId params at url to present it on this page
export async function getServerSideProps({ locale, query }) {
  //getStaticProps
  // get documents registered to this RFP here

  return {
    props: {
      query: query,
      ...(await serverSideTranslations(locale, [
        "rfps",
        "common",
        "gralerrors",
        "menus",
        "companies",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default HomeRFP;
