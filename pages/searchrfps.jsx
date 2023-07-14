import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Spinner from "../components/layouts/Spinner";
import DisplayResults from "../components/DisplayResults";
import SearchDB from "../components/SearchDB";
import { rfpParams } from "../utils/rfpItems";
import { buildRFPURL } from "../utils/buildRFPURL";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Searchrfps() {
  // const { locale,pathname, query, asPath   } = useRouter();
  const [IsWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState({});
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleShowRFP = (rfpParams) => {
    setIsWaiting(true);
    const urlLine={
      companyId: rfpParams.companyId,
      companyname: rfpParams.companyname,
      rfpidx:rfpParams.rfpidx
    }
    const rfphomeparams = buildRFPURL(urlLine);
    router.push("/homerfp?" + rfphomeparams);
  };

 const { t } = useTranslation(["rfps","gralerrors"]);
  
 const rfpActions = [
    {
      id: 1,
      iconAction: "👁️",
      titleAction: t('review',{ns:"common"}), //📝
      callBack: handleShowRFP,
      width: "[15%]",
    },
  ];

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  useEffect(() => {
    if (error.message) {
      errToasterBox(error.message)}
  }, [error]);

 
  return (
    <div id="rfps">
      <h1 className="mt-4 text-stone-500 text-2xl text-center">
        {t("titlescreen")}
      </h1>
      <div id="rfp-search" className="mt-2  bg-white flex rounded-lg justify-beetween py-2 border-2 border-orange-200">
        <div id="search-bar-holder" className="">
          <SearchDB
            fields={rfpParams}
            path={`/api/serverrfp?`}
            setResults={setResults}
            setWait={setIsWaiting}
            setError={setError}
            t={t}
          />
        </div>
      </div>
      <div id="rfp-result"></div>
      {IsWaiting ? (
        <div className="mt-24 mb-4">
          <Spinner />
        </div>
      ) : (
        <div className="mt-8 w-full">
          {results.length > 0 ? (
            <DisplayResults
              fields={rfpParams}
              results={results}
              actions={rfpActions}
              t={t}
            />
          ) : (
            <div className="bg-orange-100 p-4 text-red-600 text-xl text-center">
              {t("noresults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "menus", "rfps","gralerrors"])),
      // Will be passed to the page component as props
    },
  };
}

export default Searchrfps;
