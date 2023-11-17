/**
 * LandingPage
 *      Page to display initial Propon Page,
 */

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/router"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { proponContext } from "../utils/pro-poncontext"
import ModalWindow from "../components/layouts/modalWIndow"
import Spinner from "../components/layouts/Spinner"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { App_Name } from "../utils/constants"

function LandingPage() {
  const [warningFlag, setWarningFlag] = useState(false)
  const { companyData, address, showSpinner, noWallet } = useContext(proponContext)
  const [hideWarning, setHideWarning]= useState(false)

  const backdropStyles = {
    width: "100%",
    height: "100%",
  }

  //********************************** hooks ****************************************** /
  const router = useRouter()
  const resourceSectionRef = useRef(null)
  const { t } = useTranslation(["common", "rfps", "gralerrs"])

  // const errToasterBox = (msj) => {
  //   toast.error(msj, toastStyle);
  // };

  const handleCreateRFP = () => {
    router.push("/createrfps")
  }

  const handleSearchRFP = () => {
    router.push("/searchrfps")
  }

  const handleSearchCompanies = () => {
    router.push("/companies")
  }

  const handlesignIn = () => {
    if (noWallet) {
      setWarningFlag(true)
    }
    if (!address) {
      setWarningFlag(true)
      return
    }
    // all clear let's go to signing this company
    router.push("/signup")
  }

  const handleGoToLearnMore = () => {
    // resourceSectionRef.current.scrollIntoView({ behavior: "smooth" })
  }

  //************************************************** Inner components  *************************/
  const InfoCard = ({ title, image, info, styleObject }) => (
    <li>
      <div
        className="font-work-sans space-y-4 p-4 h-full  rounded-lg bg-white"
        //style={{boxShadow: '0px 0px 15px 0 rgb(0, 68, 102, 0.9)'}}
        style={styleObject}
      >
        <div className=" flex items-center aspect-w-3 aspect-h-2 ">
          <Image height={32} width={32} className="" src={image} alt="Info" />
          <p
            className="ml-4 mt-5 lg:text-lg  xl:text-xl 2xl:text-2xl text-stone-800"
            style={{ textShadow: "0 2px 5px rgba(0, 0, 0, 0.4)" }}
          >
            {title}
          </p>
        </div>
        <div className="space-y-2">
          <div className=" text-lg leading-6 font-medium space-y-1">
            <h3 className="mt-8 text-stone-500 text-components font-semibold font-inter text-justify">
              {info}
            </h3>
          </div>
        </div>
      </div>
    </li>
  )

  const Card = ({ title, image, link }) => (
    <div className="text-center w-128">
      <a
        className="text-stone-500 text-md text-xl underline-none"
        href={link}
        // target="_blank"
        // rel="noopener noreferrer"
      >
        <span>
          <div
            className="  rounded-xl"
            //style={{boxShadow:'10px 10px 15px 0 rgba(0, 0, 255, 0.5)'}}
          >
            <Image
              width={400}
              height={500}
              className="object-aspect mx-auto rounded-xl "
              src={image}
              alt={title}
            />
          </div>
        </span>
        <h2 className="pt-8 text-white text-3xl font-bold my-2 tracking-wider  transform transition  hover:scale-105 hover:text-blue-900">
          {title}
        </h2>
      </a>
    </div>
  )
  //553014
  const CTA_Card = () => (
    <div
      id="butttons-actions-component"
      className=" mx-auto xl: mb-16  py-8 bg-gradient-to-b from-[#5c5c63] to-black via-orange-700"
    >
      <p className=" sm:mt-2 lg:mt-4 font-inter text-center lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-white italic p-4">
        {t("title_instructions")}
      </p>
      <div id="instructions" className="py-16 flex justify-center ">
        <ul
          className="leading-8 font-inter sm:text-md md:text-md lg:text-lg xl:text-lg text-stone-200 px-8 py-20"
          style={{ boxShadow: "10px 10px 25px 0 rgba(255, 255, 255, 0.7)" }}
        >
          <li className="mb-4">
            <label className="font-bold px-2  text-stone-700 bg-blue-500 rounded-full">
              1
            </label>
            <label className="ml-8">{t("click_on_connect_wallet")}</label>
          </li>
          <li className="mb-4">
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">
              2
            </label>
            <label className="ml-8">
              {t("create_an_account_with_pro_pon")}
            </label>
          </li>
          <li className="mb-4">
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">
              3
            </label>
            <label className="ml-8">{t("complete_your_company_profile")}</label>
          </li>
          <li>
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">
              4
            </label>
            <label className="ml-8">
              {t("start_creating_or_bidding_on_rfps")}
            </label>
          </li>
        </ul>
      </div>

      <div id="buttons_cta" className="py-8 flex justify-center ">
        {companyData?.companyname ? (
          <button className="flashy-main-btn " onClick={handleCreateRFP}>
            {t("transactions.createrfp", { ns: "rfps" })}
          </button>
        ) : (
          <button className="flashy-main-btn " onClick={handlesignIn}>
            {t("signup")}
          </button>
        )}
        <button
          id="connect-wallet-cta"
          className="flashy-secondary-btn ml-8"
          onClick={handleGoToLearnMore}
        >
          {t("learn_more")}
        </button>
      </div>
    </div>
  )

  const AskforWalletInstallation = () => (
    <>
      <div
        id="connectwallet_image"
        className="flex items-center justify-between p-8"
      >
        <div className="pr-8">
          <Image
            src="/information.svg"
            height={45}
            width={45}
            alt="warning"
            className="object-contain"
          />
        </div>
        <div className="text-left pr-8">
          <p className="text-stone-900 text-center mb-2 font-bold ">
            {t("no_metamask_wallet")}
          </p>
          <p className="text-stone-900 ">
            {t("consult_rfps")}
          </p>
          <ul className="pt-4 list-inside text-stone-800">
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("click_header")}</span>
            </li>
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("install_metamask")}</span>
            </li>
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("get_matic")}</span>
            </li>
          </ul>
          <p className="mt-4 bgp-2  text-red-500">
            {t("backup_keys")} {App_Name}
          </p>
          <p className="mt-4 bg-yellow-200 p-2 font-bold text-red-500 text-center">
            {t("lose_access")}
          </p>
        </div>
        <div
          id="button_image"
          className={`${styles.header_bg_color} h-48 flex items-center justify-center rounded-xl px-6`}
        >
          <button
            className="ml-8 p-2 font-work-sans font-black text-sm uppercase  text-white bg-orange-600 rounded-xl  drop-shadow-lg
               bg-gradient-to-r from-orange-500  to-red-500 hover:outline hover:outline-2 hover:outline-orange-300
               hover:outline-offset-2 pointer-events-none"
          >
            <p>{t("getmetamask")}</p>
          </button>
        </div>
      </div>
    </>
  )

  const AskforWalletConection = () => (
    <>
      <div
        id="connectwallet_image"
        className="flex items-center justify-between p-8"
      >
        <div className="pr-8">
          <Image
            src="/information.svg"
            height={45}
            width={45}
            alt="warning"
            className="object-contain"
          />
        </div>
        <div className="text-left pr-8">
          <p className="text-stone-900">{t("connect_wallet_prompt")}</p>
          <ul className="pt-4 list-inside text-stone-800">
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("click_connect_wallet")}</span>
            </li>
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("enter_password")}</span>
            </li>
            <li className="flex items-start space-x-1">
              <span>•</span>
              <span>{t("accept_connection")}</span>
            </li>
          </ul>
          <p className="mt-4 text-stone-800"> {t("permission_stayed")}</p>
        </div>
        <div
          id="button_image"
          className={`${styles.header_bg_color} h-48 flex items-center justify-center rounded-xl px-6`}
        >
          <button className="main-btn pointer-events-none">
            <p>{t("connect_wallet")}</p>
          </button>
        </div>
      </div>
    </>
  )

  //****************************  main JSX ********************************************************* */

  return (
    <div
      id="landing-page"
      className="bg-gradient-to-br from-orange-100 via-slate-200 to-blue-100 "
      // className="bg-[#1f1929] from-orange-100 via-slate-200 to-blue-100 "
    >
      {/* Temporal Marquee for Beta Testing */}
      { !hideWarning &&
      <div className="overflow-hidden w-full h-12  flex items-center justify-center  bg-stone-300">
        <div className="relative w-full">
          <div className="absolute animate-marquee">
            <p className="whitespace-nowrap text-lg font-base text-orange-700 leading-none">
              {t("beta_testing")}
            </p>
          </div>
        </div>
      </div>}
      {  !hideWarning &&
        <div className="my-4 flex justify-center ">
          <button className="main-btn" onClick={()=>{setHideWarning(true)}}>
            {t('warninghide',{ns:"common"})} 
          </button>
        </div>
      }

      <section className="flex-1 mt-2 bg-orange-400 min-h-[55vh] ">
        <div className="w-full flex flex-col justify-center items-center ">
          <h1 className="mt-32 text-stone-600 lg:text-2xl xl:text-4xl 2xl:text-5xl  font-roboto font-semibold tracking-tighter ">
            {t("header_1", { ns: "common" })}
          </h1>
          <h2 className="text-white font-roboto landing-page-bullets italic mt-12 mb-4 p-3 font-semibold bg-gradient-to-r from-blue-500 to-orange-600">
            {t("subtitle", { ns: "common" })}
          </h2>
          <p className="max-w-[900px] font-work-sans text-stone-100 text-center lg:my-8 2xl:my-8 text-base lg:text-base xl:text-xl ">
            {t("subHeader1", { ns: "common" })}
          </p>
        </div>
      </section>

      {showSpinner && (
        <div className="absolute bottom-[45%] left-[45%]">
          <Spinner />
        </div>
      )}

      {noWallet && warningFlag && (
        <ModalWindow setFlag={setWarningFlag} closeLabel={t("close")}>
          <AskforWalletInstallation />
        </ModalWindow>
      )}
      {!noWallet && warningFlag && (
        <ModalWindow setFlag={setWarningFlag} closeLabel={t("close")}>
          <AskforWalletConection />
        </ModalWindow>
      )}

      <section
        id="explaining-problem"
        className="h-[94]  bg-white p-24 flex items-center gap-x-16"
      >
        <div className="w-[50%] lg:w-[70%]  m-8 mx-auto font-work-sans  text-stone-500 ">
          <p className="auto-mx font-bold pl-4 lg:text-lg xl:text-2xl 3xl:text-3xl">
            {t("problems", { ns: "common" })}
          </p>
          <p className="pl-4 pt-4 auto-mx  font-semibold lg:text-base xl:text-xl">
            {t("solutions", { ns: "common" })}
          </p>
          <ul className="ml-12  list-disc text-components mt-6 mb-4 space-y-2 landing-page-bullets">
            <li> {t("bul_sol1", { ns: "common" })} </li>
            <li> {t("bul_sol2", { ns: "common" })} </li>
            <li> {t("bul_sol3", { ns: "common" })} </li>
            <li> {t("bul_sol4", { ns: "common" })} </li>
          </ul>
        </div>
        <Image
          src={"/propon-hero-1.png"}
          className="object-fit rounded-2xl opacity-90"
          height={400}
          width={400}
          alt="problemsimage"
          priority
        />
      </section>

      <section
        id="propon-solution-introduce"
        className="  xl:my-12 flex items-center justify-center py-16 "
      >
        <div className="bg-white p-8 rounded-lg py-24">
          <p className="text-stone-600 font-roboto mb-2 font-bold pl-4 lg:text-lg xl:text-2xl 3xl:text-3xl ">
            {t("secure", { ns: "common" })}
          </p>
          <p className="text-orange-400 font-roboto mb-6 font-semibold pl-4 lg:text-base xl:text-lg 2xl:text-xl lg:w-[45em] xl:w-[49em] 2xl:w-[50em] 3xl-[54em]">
            {t("secure_subtitle", { ns: "common" })}
          </p>
            <ul className="text-stone-500 pl-8 font-roboto list-disc space-y-4 landing-page-bullets">
              <li>
                {" "}
                <p className="lg:w-[44em] w-[60em] wrap">
                  {" "}
                  {t("sol_bul2", { ns: "common" })}
                </p>
              </li>
              <li>
                {" "}
                <p className="lg:w-[44em] w-[60em] wrap">
                  {" "}
                  {t("sol_bul3", { ns: "common" })}
                </p>
              </li>
            </ul>
        </div>
      </section>

      <section className="  h-8 "></section>

      {address && !companyData?.companyname && (
        <div className="  w-[40%] mx-auto flex justify-center  ">
          <button className="flashy-main-btn m-8" onClick={handlesignIn}>
            {t("signup")}
          </button>
        </div>
      )}

      <div
        id="informative-intro-cards"
        className="sm:my-16 md:my-18 lg:my-24 xl:my-24  py-8 bg-orange-300"
      >
        <div className="w-3/4 mx-auto divide-y-2 divide-gray-200">
          <ul
            className="mt-4 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16 
                grid-auto-rows p-4"
          >
            <InfoCard
              title={t("transp_proc")}
              image={"/magnifier-lined.svg"}
              info={t("enter_new_era_of_fairness")}
              styleObject={{
                boxShadow: "5px 0px 15px 0 rgb(0, 41, 102, 0.9)",
              }}
            />
            <InfoCard
              title={t("pub_rfp_bc")}
              image={"/blockchain.png"}
              info={t("data_documents_fortified")}
              styleObject={{
                boxShadow: "5px 0px 15px 0 rgb(89, 0, 179, 0.9)",
              }}
            />
            <InfoCard
              title={t("unvel_post_rfp")}
              image={"/personsearch.svg"}
              info={t("upon_completion_of_rfp")}
              styleObject={{ boxShadow: "5px 0px 15px 0 rgb(0, 0, 0, 0.9)" }}
            />
            <InfoCard
              title={t("build_bc_rep")}
              image={"/education-64.png"}
              info={t("create_immutable_trail")}
              styleObject={{
                boxShadow: "5px 0px 15px 0 rgb(153, 38, 0, 0.9)",
              }}
            />
          </ul>
        </div>
      </div>

      <div
        id="CTA-subsection"
        className="lg:mb-24 xl:mb-48"
        style={{
          boxShadow:
            "0px 5px 15px 0 rgba(0, 0, 0, 0.9), 0px -5px 25px 0 rgba(0, 0, 0, 0.9)",
        }}
      >
        <CTA_Card />
      </div>

      <div className=" mx-auto">
        <div
          id="no-signup-notice"
          className="font-work-sans text-center p-4 my-32"
          //style={{boxShadow: '0px 5px 15px 0 rgba(255, 165, 0, 0.6), 0px -5px 25px 0 rgba(255, 165, 0, 1.5)'}}
        >
          <p className="font-semmibold text-stone-600 lg:text-lg xl:text-xl 2xl:text-2xl">
            {t("no_signup")}
          </p>
          <p className="font-inter text-stone-500 lg:text-lg xl:text-xl 2xl:text-2xl mt-2 tracking-wide">
            {t("browse_rfp")}
          </p>
          <div className="pt-8 pb-2 text-center">
            <button
              className="mx-4 blueblack-btn"
              onClick={handleSearchCompanies}
            >
              {t("search_companies")}
            </button>
            <button className="mx-4 blueblack-btn" onClick={handleSearchRFP}>
              {t("search_rfps")}
            </button>
          </div>
        </div>
      </div>

      <div
        id="second-section"
        className="mx-auto py-8 lg:my-16 xl:my-20  font-inter  bg-gradient-to-b from-blue-100 to-stone-400  via-orange-200  rounded-2xl  "
      >
        <div
          id="features-subsection"
          className="flex items-center  justify-end mt-12 space-y-12 lg:space-y-0 lg:gap-x-4 xl:gap-y-10  "
        >
          <div className="lg:w-[50%] xl:w-[60%] lg:mr-16 2xl:mr-32">
            <p
              className="text-center  mb-8 lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-blue-800"
              style={{ textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)" }}
            >
              {t("features_label")}
            </p>
            <ul className=" ml-8  lg:text-base xl:text-lg 2xl:text-xl text-stone-700 pl-4 list-none leading-[1.2rem] mb-8">
              <li className="relative landing-page-bullets">
                <span className="absolute left-[-1.5em] text-blue-900  font-extrabold">
                  ‣
                </span>
                <strong>{t("global_marketplace_label")}</strong>{" "}
                {t("global_marketplace_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800  font-extrabold">
                  ‣
                </span>
                <strong>{t("digital_signing_label")}</strong>{" "}
                {t("digital_signing_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800  font-extrabold">
                  ‣
                </span>
                <strong>{t("confidentiality_label")}</strong>{" "}
                {t("confidentiality_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800  font-extrabold">
                  ‣
                </span>
                <strong>{t("traceability_label")}</strong>{" "}
                {t("traceability_description")}
              </li>
            </ul>
          </div>
          <div className="">
            <Image
              height={500}
              width={400}
              className="object-cover rounded-2xl"
              src="/propon-graphic2.jpeg"
              alt="graphic1"
            />
          </div>
        </div>
      </div>

      <footer
        id="foot-section"
        className="bg-gradient-to-t from-black to-orange-400 via-stone-800  text-stone-100 text-center
              sm:text-sm md:text-md lg:text-lg xl:text-lg font-inter"
      >
        <div
          id="polygon-arweave-logos"
          className="flex justify-center items-center"
        >
          <p className="text-white font-bold pr-4"> {t("powerby")}: </p>
          <div className="flex justify-center">
            <Image
              height={130}
              width={130}
              className=" object-contain"
              src="/polygon_blockchain_logo.png"
              alt="Polygon Logo"
            />
            <span className="w-[25px]"></span>
            <Image
              height={130}
              width={130}
              className=" object-contain "
              src="/full-arweave-logo.svg"
              alt="Arweave Logo"
            />
            <span className="w-[25px]"></span>
          </div>
        </div>
        <p className="-mt-8 pb-2 text-stone-300">{t("site_for_polygon")}</p>
        <div className="mt-4">
          <a
            href="/terms-of-service"
            className="underline text-stone-100 hover:text-stone-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("service_terms")}
          </a>{" "}
          |
          <a
            href="/privacy-policy"
            className="underline text-stone-100 hover:text-stone-500 ml-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("privacy_police")}
          </a>
        </div>
        <div className="mt-6">
          &copy; {new Date().getFullYear()} rovicher.eth
          <a
            href="https://twitter.com/_propon"
            className=" text-stone-100 hover:text-stone-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex justify-center items-center pb-8">
              <Image
                height={50}
                width={50}
                className="object-contain"
                alt="twitter-logo"
                src="/twitter-logo.svg"
              />
              <p className="no-underline">@_propon</p>
            </div>
          </a>
        </div>
      </footer>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "rfps",
        "gralerrors",
        "menus",
        "companies",
      ])),
    },
  }
}

export default LandingPage
