/**
 * MyRFPs
 *      Page to display RFPs belonging to current company,
 *      It should read them from Contract, not DB
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, useCallback, useContext, Fragment } from "react"
// import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { getRFPsbyCompanyAddress } from "../web3/getRFPsbyCompanyAddress"
import RfpCards from "../components/layouts/RfpCards"
import { proponContext } from "../utils/pro-poncontext"
import Spinner from "../components/layouts/Spinner"
import { Warning } from "../components/layouts/warning"
import { errorSmartContract } from "../utils/constants"

function MyRFPs() {
  //const [declared, setDeclared] = useState(false);
  const [typeRFP, setTypeRFP] = useState("open")
  // const [isOpen, setIsOpen] = useState(false);
  // const [isInvitation, setIsInvitation] = useState(false);
  const [isPending, setIsPending] = useState(false)
  const [isDeclared, setIsDeclared] = useState(false)
  const [isCanceled, setIsCanceled] = useState(false)

  const [filtering, setFiltering] = useState(false)
  const [contractRFPs, setContractRFPs] = useState([])
  const [RFPs, setRFPs] = useState([])
  // const [noRFP, setNoRFP] = useState(false)
  const [searching, setSearching] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)

  const typeOfContest = ["open", "invitation"]
  const contestStatus = ["declared", "canceled"]

  const { companyData, address } = useContext(proponContext)
  const { t } = useTranslation("rfps")

  useEffect(() => {
    setFiltering(true)
    let filteredRFPs = []
    filteredRFPs = contractRFPs.filter(
      (rfp) => rfp.contestType === (typeRFP === "open" ? 0 : 1)
    ) // filter if open
    if (isCanceled) filteredRFPs = filteredRFPs.filter((rfp) => rfp.canceled)
    if (isDeclared)
      filteredRFPs = filteredRFPs.filter((rfp) => rfp.winners.length > 0)
    setRFPs(filteredRFPs)
    setFiltering(false)
  }, [contractRFPs, typeRFP, isCanceled, isDeclared, isPending])

  useEffect(() => {
    async function getCompanyRFPs() {
      if (address) {
        const result = await getRFPsbyCompanyAddress(address)
        if (result.status) {
          setContractRFPs(result.RFPs)
        } else if (result.msg) errorSmartContract(result.msg)
      }
      setSearching(false)
    }
    getCompanyRFPs()
  }, [address, typeRFP])

  // ******************************* handlers ******************************************** */

  const handleStatusChange = (option) => {
    switch (option) {
      case "pending":
        setIsPending((previous) => !previous)
        break
      case "declared":
        setIsDeclared((previous) => !previous)
        break
      case "canceled":
        setIsCanceled((previous) => !previous)
        break
    }
  }

  const handleTypeChange = (id) => {
    setTypeRFP(id)
  }

  // ******************************* Utility functions *********************** */
  const statusSelector = (option) => {
    if (option === "pending") {
      return isPending
    } else if (option === "canceled") {
      return isCanceled
    }
    return isDeclared
  }

  // ****************************** Inner components ********************************   */

  // ******************************** Main JSX ********************************   */

  if (!address) return <Warning title={t("notconnected", { ns: "common" })} />
  if (searching)
    return (
      <div className="mt-4 border-orange-500 p-8">
        <Spinner />
      </div>
    )
  if (isWaiting)
    return (
      <div className="mt-4 border-orange-500 p-8">
        <Spinner />
      </div>
    )
  if (!companyData?.companyname)
    return <Warning title={t("nocompany", { ns: "common" })} />

  return (
    <div className=" mx-8 p-2">
      <div
        className="bg-orange-200   mx-auto mt-2 mb-4  p-4 rounded-lg font-work-sans text-stone-900 shadow-md "
        style={{ boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)" }}
      >
        <div id="tpyecontest" className=" items-center">
          <div className="flex">
            <div
              id="tpyecontest"
              className="ml-8 flex items-center pl-4 p-2 border-2 border-stone-100 rounded-md"
            >
              <p className="ml-2 mr-8 font-semibold">{t("contestType")}: </p>
              <div className="flex flex-col lg:text-xs xl:text-sm 2xl:text-base">
                {typeOfContest.map((option) => (
                  <label key={option} htmlFor={option}>
                    <input
                      //key={option}
                      type="radio"
                      id={option}
                      name="typeRFP"
                      value={t(option)}
                      checked={typeRFP === option}
                      onChange={() => handleTypeChange(option)}
                    />
                    <span className="ml-2">{t(option)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className=""></div>
            <div
              id="statusContest"
              className="font-work-sans ml-8 flex items-center  pl-4 p-2 border-2 border-stone-100  rounded-md"
            >
              <p className="ml-2 mr-8 font-semibold">{t("status")}:</p>
              <div className="flex flex-col">
                {contestStatus.map((option) => (
                  <span key={option}>
                    <input
                      id={option}
                      name="statusRFP"
                      type="checkbox"
                      key={option}
                      value={t(`${option}`)}
                      checked={statusSelector(option)}
                      onChange={() => handleStatusChange(option)}
                    />
                    <label
                      className="ml-4 lg:text-xs xl:text-sm 2xl:text-base"
                      htmlFor={option}
                    >
                      {t(option)}
                    </label>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {filtering && <Spinner />}
      {RFPs.length > 0 ? (
        <RfpCards
          rfps={RFPs}
          setIsWaiting={setIsWaiting}
          companyData={companyData}
          t={t}
        />
      ) : (
        <Warning title={t("noresults", { ns: "common" })} />
      )}
    </div>
  )
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
  }
}

export default MyRFPs
