import { useState, useEffect } from "react"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { buildRFPURL } from "../utils/buildRFPURL"
import Spinner from "../components/layouts/Spinner"
import DisplayResults from "../components/DisplayResults"
import SearchDB from "../components/SearchDB"
import { companyParams } from "../utils/companyItems"
import CtlPagination from "../components/ctlPagination"
import { PAGE_SIZE } from "../utils/constants"
import { toastStyle } from "../styles/toastStyle"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Companies() {
  const [IsWaiting, setIsWaiting] = useState(false)
  const [error, setError] = useState(false)
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [numberPages, setNumberPages] = useState(0)
  const { t, i18n } = useTranslation("companies", "gralerrors")
  const router = useRouter()

  const handleShowCompany = (company) => {
    setIsWaiting(true)
    const urlLine = {
      companyid: company.companyId,
    }
    const companyparams = buildRFPURL(urlLine)
    router.push("/company?" + companyparams)
  }

  const companyActions = [
    {
      id: 1,
      iconAction: "👁️",
      titleAction: t("review", { ns: "common" }),
      callBack: handleShowCompany,
      width: "[25%]",
    },
  ]

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle)
  }

  // hooks ****************************************************************************************
  useEffect(() => {
    if (error.message) errToasterBox(error.message)
  }, [error])

  useEffect(() => {
    // recalculate displaying params when result set changes
    if (results.length) {
      setNumberPages(Math.ceil(results.length / PAGE_SIZE))
      setCurrentPage(1) // reset page to diplay
    }
  }, [results])

  return (
    <div id="companies">
      <h1 className="mt-4 font-work-sans text-stone-500  text-center">
        {t("titlescreen")}
      </h1>
      <div
        id="companies-search"
        className="mt-2  bg-white flex 
                rounded-lg justify-beetween py-2 border-2 border-orange-200 overflow-x-auto"
      >
        {/* <SearchIcon className="ml-8 h-8 w-8 text-orange-400  " /> */}
        <div className="w-[100%] pl-0 flex justify-between">
          <SearchDB
            fields={companyParams}
            path={`/api/servercompanies?`}
            setResults={setResults}
            setWait={setIsWaiting}
            setError={setError}
            t={t}
            i18n={i18n}
          />
        </div>
      </div>
      <div id="companies-result"></div>
      {IsWaiting ? (
        <div className="mt-24 mb-4 ">
          <Spinner />
        </div>
      ) : (
        <div className="mt-8 w-full">
          {results.length > 0 ? (
            <>
              <DisplayResults
                fields={companyParams}
                results={results}
                actions={companyActions}
                firstRecord={PAGE_SIZE * (currentPage - 1)}
                lastRecord={currentPage * PAGE_SIZE}
                currentPage={currentPage}
                t={t}
              />
              {Boolean(results.length) && (
                <CtlPagination
                  setCurrentPage={setCurrentPage}
                  numberPages={numberPages}
                  currentPage={currentPage}
                  t={t}
                />
              )}
            </>
          ) : (
            <div className="font-work-sans bg-orange-100 p-4 text-red-600 text-xl text-center">
              {t("noresults", { ns: "common" })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "menus",
        "companies",
        "gralerrors",
      ])),
      // Will be passed to the page component as props
    },
  }
}

export default Companies
