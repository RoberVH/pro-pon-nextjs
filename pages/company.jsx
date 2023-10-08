/**
 * company.jsx
 *    Page-level component (url: /company?companyid=xxxx) Extracts from URL the companyid parameter and search the added company
 *    data from Datab Base, then get additional information from smart contract based on the retreieved company ethereum address
 *    to display company in a table
 */

import React, { useContext, useEffect, useState } from "react"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { proponContext } from "../utils/pro-poncontext"
import { Warning } from "../components/layouts/warning"
import { getCompanydataDB } from "../database/dbOperations"
import { getCompanyDatafromContract } from "../web3/getCompanyDatafromContract"
import { toastStyle } from "../styles/toastStyle"
import { toast } from "react-toastify"
import { buildRFPURL } from "../utils/buildRFPURL"
import Spinner from "../components/layouts/Spinner"
import TableValueDisplay from "../components/tableValueDisplay"
import { getRFPCompanyIssuer } from "../web3/getRFPCompanyIssuer"
import { parseWeb3Error } from "../utils/parseWeb3Error"


function Company() {
  const [selectedCompanyData, setSelCompanyData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()
  const { companyid } = router.query
  const { t } = useTranslation(["companies", "gralerrors", "common","rfps","menus"])
  
  const {  noRightNetwork, noWallet } = useContext(proponContext)
  


    // utility functions  ********************************************************
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle)
  }

  // hooks  ********************************************************
  useEffect(() => {
    async function fetchData() {
      try {
        if (!companyid) {
          throw new Error(t("no_companyid",{ns:"gralerrors"}))
        }
        const result = await getCompanydataDB(companyid)
        if (!result.status) {
          throw new Error(t(result.msg,{ns:"gralerrors"}))
        }
        if (window.ethereum && !window.ethereum.selectedAddress) {
          // MetaMask is not connected, request access
          await window.ethereum.enable()
        } else {
          // if there is wallet and not connected to right network raise error
          if (noRightNetwork && !noWallet) {
            throw new Error("no_right_network")
          } 
          // all ok, go ahead 
          const resp = await getCompanyDatafromContract(result.data.address, t)
          if (!resp.status) {
            throw new Error(resp.msg)
          }
          // This destructuring is because we are using a legacy function depending if it is using local provider or server alchemy prov
          let sourceData = resp.data.company ? resp.data.company : resp.data  
          let { company_RFPs, RFPsWins, RFPParticipations } = sourceData
          let RFPsWinings =   RFPsWins.map((rfp) => parseInt(rfp))
          company_RFPs =      company_RFPs.map((rfp) => parseInt(rfp))
          RFPParticipations = RFPParticipations.map((rfp) => parseInt(rfp))
          setSelCompanyData({
            RFPsWinings,
            RFPParticipations,
            company_RFPs,
            ...result.data
          })
        }
    } catch (error) {
        const customError = parseWeb3Error(t, error)
        errToasterBox(customError)
      } finally {
        setIsLoading(false)
      }
    }
      setIsLoading(true)
      fetchData()
  }, [companyid])



  //  handlers     ****************************************************************************
  const handleShowRFP = async (rfpidx) => {
    // need to get owner company of Selected RFP
    // get Companyname and companyId with rfpIdx
    const CompanyRFPIssuer = await getRFPCompanyIssuer( rfpidx,t)
    const {id, name} = CompanyRFPIssuer.data
    const urlLine = {
      companyId: id,
      companyname: name,
      rfpidx: rfpidx
    }
    const rfphomeparams = buildRFPURL(urlLine)
    router.push("/homerfp?" + rfphomeparams)
  }

  const CompanyTable = () => {
    const fieldOrder = [
      "profileCompleted",
      "companyId",
      "country",
      "address",
      "adminname",
      "email",
      "website",
      "company_RFPs",
      "RFPParticipations",
      "RFPsWinings"
    ]


    return (
      <>
        {fieldOrder.map((key) => {
          const value = selectedCompanyData[key]
          if (value !== undefined && key !== "_id") {
            return (
              <tr key={key} className="border-b-[1px] border-slate-200">
                <td className="w-64 pl-4 text-stone-500 text-bold border-r-[1px] border-blue-500">
                  {t(key)}
                </td>
                <td className="p-4 text-stone-500 overflow-x-auto">
                  <TableValueDisplay value={value} handleShowRFP={handleShowRFP} t={t} RFP_INTERVAL={5} />                  
                </td>
              </tr>
            )
          }
        })}
      </>
    )
  }

  // Returning  component JSX *******************************************************
  if (isLoading) {
    return (
      <div className="mt-24 mb-4">
        <Spinner />
      </div>
    )
  }

  if (!selectedCompanyData) {
    return <Warning title={t("company_notfound",{ns:"gralerrors"})} />
  }

  return (
    <section className="">
      <table className="table-fixed w-[80%] min-w-[60%] max-w-[80%] bg-white mx-auto mt-8 shadow-lg rounded-xl">
        <thead>
          <tr className="bg-slate-500">
            <th className="w-1/5 text-center p-4 border-b-[1px]   text-white rounded-tl-xl "></th>
            <th className="w-4/5 text-left p-4 border-b-[1px]   text-white rounded-tr-xl">
              {selectedCompanyData.companyname}
            </th>
          </tr>
        </thead>
        <tbody>
          <CompanyTable />
          <tr key="final" className="h-4">
            <td className="w-1/4"></td>
            <td className="w-3/4"></td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

//export async function getStaticProps({ locale }) {
  export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "companies",
        "common",
        "rfps",
        "gralerrors",
        "menus"
      ]))
    }
  }
}

export default Company
