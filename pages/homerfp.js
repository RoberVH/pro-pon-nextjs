import { useState, useEffect, useCallback } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import RFPessentialData from "../components/rfp/RFPessentialData";
import UploadRFP from "../components/rfp/uploadRFP";

import { convDate } from "../utils/misc";
import Spinner from "../components/layouts/Spinner";
import { DonwloadFileForm } from "../components/rfp/DonwloadFileForm";

function HomeRFP({ query }) {
  //{rfpRecord}
  //const {  locale } = useRouter();

  const [rfpRecord, setRfpRecord] = useState();
  const [files, setFiles] = useState([]);
  const [rfpfiles, setRFPFiles] = useState([]);
  
  //const router = useRouter()
  const { t } = useTranslation("rfps");

  //const query = router.query
  //console.log('query',query)

  const processFiles = useCallback(() => {
    const arrayFiles = [];
    Array.from(files).forEach((file) => {
      arrayFiles.push(file.name);
    });
    console.log("setting RFPFILES con", arrayFiles);
    setRFPFiles(arrayFiles);
  }, [files]);

  useEffect(() => {
    const getRFP = () => {
      setRfpRecord(query);
      console.log('Setting query',query)
    };
    getRFP();
  }, [query]);

  useEffect(() => {
    console.log("(homerfp) Procesar files:", files);
    if (files.length) processFiles(files);
  }, [files, processFiles]);

  const handleDeclareWinner = () => {
    console.log("handleDeclareWinner");
  };

  if (!rfpRecord) return <div>Sin RFP</div>;
  return (
    <div>
      <div className="mt-2 my-2 mx-8 outline outline-1 outline-orange-200 flex justify-center bg-white shadow-md">
        <label className="p-2 ">{t("rfpform.name")}: &nbsp; </label>
        <label className="pt-2 text-orange-500">{rfpRecord.name}</label>
      </div>
      <div className="mt-2">
        {RFPessentialData(t, rfpRecord, handleDeclareWinner)}
      </div>
      <div className="mt-2">
        <UploadRFP t={t} rfpfiles={rfpfiles} setFiles={setFiles} />
      </div>
      <div className="mt-2">
        <DonwloadFileForm files={rfpfiles} t={t} />
      </div>
    </div>
  );
}

// Get language translation json files  and the rfpId params at url to present it on this page
export async function getServerSideProps({ locale, query }) {
  //getStaticProps
  // const query = router.query
  return {
    props: {
      query: query,
      ...(await serverSideTranslations(locale, ["rfps", "common", "menus"])),
      // Will be passed to the page component as props
    },
  };
}

export default HomeRFP;
