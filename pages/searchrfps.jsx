import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import  Spinner  from '../components/layouts/Spinner'
import { SearchIcon } from "@heroicons/react/outline";
import DisplayResults from "../components/DisplayResults";
import SearchDB from "../components/SearchDB";
import { rfpParams, rfpActions } from "../utils/rfpItems";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Searchrfps() {
  const { locale,pathname, query, asPath   } = useRouter();
  const [ IsWaiting, setIsWaiting] = useState(false)
  const [ error, setError] = useState(false)
  const [results, setResults] = useState([]);

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };


   useEffect(() => {
    if (error.message) errToasterBox(error.message);
  }, [error]);

  const router = useRouter()

 const { t } = useTranslation("rfps");
  return (
    <div id="rfps">

      <h1 className="mt-4 text-stone-500 text-2xl text-center">
        {t("titlescreen")}
      </h1>
      <div
        id="rfp-search"
        className="mt-4  bg-white flex 
                rounded-lg justify-beetween py-4 border-2 border-orange-200"
      >
        <SearchIcon className="ml-8 h-8 w-8 text-orange-400  " />
        <div className="w-[100%] pl-4">
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
      {  IsWaiting ? 
           <Spinner /> :
          (<div className="mt-8 w-full">
            {(results.length>0) ? (
              <DisplayResults
                fields={rfpParams}
                results={results}
                actions={rfpActions}
                t={t}
              />
            ) :   <div className="bg-orange-100 p-4 text-red-600 text-xl text-center">
                    {t('noresults')}
                  </div>}
          </div>)
      }
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "menus",
        "rfps",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default Searchrfps;
