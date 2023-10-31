import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Spinner from "../components/layouts/Spinner";
import DisplayResults from "../components/DisplayResults";
import CtlPagination from '../components/ctlPagination';
import SearchDB from "../components/SearchDB";
import { rfpParams } from "../utils/rfpItems";
import { buildRFPURL } from "../utils/buildRFPURL";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PAGE_SIZE } from '../utils/constants'

function Searchrfps() {
  const [IsWaiting, setIsWaiting] = useState(false)
  const [error, setError] = useState({})
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage]=useState(1)
  const [numberPages, setNumberPages]=useState(0)
  

  
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

  useEffect(()=>{
    // recalculate displaying params when result set changes
    if (results?.length) {
      setNumberPages(Math.ceil(results.length/PAGE_SIZE))
      setCurrentPage(1) // reset page to diplay
    }
  }
  ,[results])
 
  return (
    <div id="rfps">
      <h1 className="mt-4 text-stone-500  text-center">
        {t("titlescreen")}
      </h1>
      <div id="rfp-search" className="mt-2  bg-white flex rounded-lg justify-beetween pt-2 pb-4 border-2 border-orange-200 overflow-x-auto">
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
          {results?.length > 0 ? (
            <>
              <DisplayResults
                fields={rfpParams}
                results={results}
                actions={rfpActions}
                firstRecord={PAGE_SIZE * (currentPage-1)}
                lastRecord={(currentPage * PAGE_SIZE)}
                currentPage={currentPage}
                t={t}
                />
              { Boolean(results.length) &&  <CtlPagination 
                    setCurrentPage={setCurrentPage}
                    numberPages={numberPages}
                    currentPage={currentPage}
                    t={t}
                  /> 
              }
            </>
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
