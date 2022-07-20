import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import  Spinner  from '../components/layouts/Spinner'
import { SearchIcon } from "@heroicons/react/outline";
import DisplayResults from "../components/DisplayResults";
import SearchDB from "../components/SearchDB";
import { companyParams, companyActions } from "../utils/companyItems";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Companies() {
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
  console.log('router',router)
//   console.log('pathname',router.pathname)
//  console.log('query',router.query)
//  console.log('asPath',router.asPath)

 const { t } = useTranslation("companies");
  return (
    <div id="companies">

      <h1 className="mt-4 text-stone-500 text-2xl text-center">
        {t("titlescreen")}
      </h1>
      <div
        id="companies-search"
        className="mt-4  bg-white flex 
                rounded-lg justify-beetween py-4 border-2 border-orange-200"
      >
        <SearchIcon className="ml-8 h-8 w-8 text-orange-400  " />
        <div className="w-[100%] pl-4">
          <SearchDB
            fields={companyParams}
            path={`/api/servercompanies?`}
            setResults={setResults}
            setWait={setIsWaiting}
            setError={setError}
          />
        </div>
      </div>
      <div id="companies-result"></div>
      {  IsWaiting ? 
           <Spinner /> :
          (<div className="mt-8 w-full">
            {(results.length>0) ? (
              <DisplayResults
                fields={companyParams}
                results={results}
                actions={companyActions}
              />
            ) : <div>No hay resultados</div>}
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
        "companies",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default Companies;
