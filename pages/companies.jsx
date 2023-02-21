import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
// import { useRouter } from "next/router";
import  Spinner  from '../components/layouts/Spinner'
import { SearchIcon } from "@heroicons/react/outline";
import DisplayResults from "../components/DisplayResults";
import SearchDB from "../components/SearchDB";
import { companyParams } from "../utils/companyItems";
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Companies() {
  //const { locale,pathname, query, asPath   } = useRouter();
  const [ IsWaiting, setIsWaiting] = useState(false)
  const [ error, setError] = useState(false)
  const [results, setResults] = useState([]);
  const { t, i18n  } = useTranslation("companies")

  const companyActions = [
    
    { id:1,
      iconAction:'',
      titleAction:t('review',{ns:"common"}),
      callBack:''}
  ]

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };


   useEffect(() => {
    if (error.message) errToasterBox(error.message);
  }, [error]);

  //const router = useRouter()


  return (
    <div id="companies">
      <h1 className="mt-4 text-stone-500 text-2xl text-center">
        {t("titlescreen")}
      </h1>
      <div
        id="companies-search"
        className="mt-2  bg-white flex 
                rounded-lg justify-beetween py-2 border-2 border-orange-200"
      >
        {/* <SearchIcon className="ml-8 h-8 w-8 text-orange-400  " /> */}
        <div className="w-[100%] pl-0">
          <SearchDB
            fields={companyParams}
            path={`/api/servercompanies?`}
            setResults={setResults}
            setWait={setIsWaiting}
            setError={setError}
            t={t}
            i18n ={i18n}
          />
        </div>
      </div>
      <div id="companies-result"></div>
      {  IsWaiting ? 
          <div className="mt-24 mb-4 ">
             <Spinner />
          </div>
           :
          (<div className="mt-8 w-full">
            {(results.length>0) ? (
              <DisplayResults
                fields={companyParams}
                results={results}
                actions={companyActions}
                t={t}
              />
            ) :   <div className="bg-orange-100 p-4 text-red-600 text-xl text-center">
                    {t('noresults',{ ns: 'common' })}
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
        "companies",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default Companies;
