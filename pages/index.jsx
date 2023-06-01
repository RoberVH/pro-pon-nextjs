/**
 * TestLandigs
 *      Page to display RFPs belonging to current company,
 *      It should read them from Contract, not DB
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, useRef, useContext} from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { proponContext } from "../utils/pro-poncontext";
import ModalWindow from '../components/layouts/modalWIndow'
import Spinner from '../components/layouts/Spinner'
import Image from "next/image";
import styles from '../styles/Home.module.css'
import { App_Name } from '../utils/constants'




function LandingPage() {
  const [warningFlag, setWarningFlag] = useState(false)
    const { companyData, address, showSpinner, noWallet  } = useContext(proponContext);

  
  //********************************** hooks ****************************************** /
  const router = useRouter()
    const resourceSectionRef = useRef(null);
  const { t } = useTranslation(["common","rfps"]);
  

  // ******************************* handlers ****************************************************/
  const handleCreateRFP = () => {
    router.push('/createrfps')
  }

  const handleSearchRFP = () => {
    router.push('/searchrfps')
  }

  const handleSearchCompanies = () => {
    router.push('/companies')
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
    router.push('/signup')

  }

  const handleGoToLearnMore = () => {
    resourceSectionRef.current.scrollIntoView({ behavior: "smooth" });
};


  //************************************************** Inner components  *************************/
  const InfoCard = ({ title, image, info }) => (
    <li>
      <div className="space-y-4 p-4 rounded-md  h-full">
        <div className=" flex items-center aspect-w-3 aspect-h-2 ">
          <Image height={32} width={32} className="" src={image} alt="Info" />
          <p className="ml-4 sm:text-lg md:mt-5 md:text-xl lg:text-2xl text-2xl text-stone-500"
          style={{textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'}}>
            {title}
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-lg leading-6 font-medium space-y-1">
            <h3 className="text-stone-700 text-lg font-semibold font-inter text-justify">
              {info}
            </h3>
          </div>
        </div>
      </div>
    </li>
  );

  const Card = ({ title, image, link }) => (
    <div className="text-center w-128">
      <a
        className="text-stone-500 text-md text-xl underline-none"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span >
           <div className=" border-b-4 border-blue-900 rounded-xl"
           style={{boxShadow:'10px 10px 15px 0 rgba(0, 0, 255, 0.5)'}} >
                <Image
                    width={400}
                    height={500}
                    className="object-aspect mx-auto rounded-xl " 
                    src={image}
                    alt={title}
                />
            </div>         
        </span>
        <h2 className="pt-8 text-blue-700 text-3xl font-bold my-2 tracking-wider  transform transition  hover:scale-105 hover:text-blue-900" >
          {title}
        </h2>
      </a>
    </div>
  );

  const CTA_Card = () => (
    <div
      id="butttons-actions-component"
      className="mx-auto xl: my-16  py-8   bg-stone-700 "
    >
      <p className=" sm:mt-2 lg:mt-4 font-inter text-center sm:text-md md:text-xl lg:text-2xl xl:text-3xl font-bold text-white italic p-4">
        {t("title_instructions")}
      </p>
      <div id="instructions" className="py-16 flex justify-center ">
        <ul
          className="leading-8 font-inter sm:text-md md:text-lg lg:text-xl xl:text-2xl text-stone-200 px-8 py-20"
          style={{ boxShadow: "10px 10px 25px 0 rgba(255, 255, 255, 0.7)" }}
        >
          <li className="mb-4">
            <label className="font-bold px-2  text-stone-700 bg-blue-500 rounded-full">1</label>
            <label className="ml-8">{t("click_on_connect_wallet")}</label>
          </li>
          <li className="mb-4">
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">2</label>
            <label className="ml-8">{t("create_an_account_with_pro_pon")}</label>
          </li>
          <li className="mb-4">
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">3</label>
            <label className="ml-8">{t("complete_your_company_profile")}</label>
          </li>
          <li>
            <label className="font-bold px-2 text-stone-700 bg-blue-500 rounded-full">4</label>
            <label className="ml-8">{t("start_creating_or_bidding_on_rfps")}</label>
          </li>
        </ul>
      </div>

      <div id="buttons_cta" className="py-8 flex justify-center ">
      {companyData?.companyname ?  
        <button className="flashy-main-btn "onClick={handleCreateRFP}>
          {t('transactions.createrfp',{ ns:"rfps" })}
        </button> 
        :
        <button className="flashy-main-btn "onClick={handlesignIn}>
          {t('signup')}
        </button> 
      }
      <button id="connect-wallet-cta" className="flashy-secondary-btn ml-8"
          onClick={handleGoToLearnMore}>
          {t("learn_more")}
      </button>
      </div>
    </div>
  );

  const AskforWalletInstallation =() =>
  <>
       <div id="connectwallet_image" className="flex items-center justify-between p-8">
         <div className="pr-8">
           <Image src='/information.svg' height={45} width={45} alt='warning' className="object-contain"/>
         </div>
           <div className="text-left pr-8">
            <p className="text-stone-900 text-center mb-2 font-bold ">{t('no_metamask_wallet')}</p>
            <p className="text-stone-900 ">{t('consult_rfps')}</p>
            <ul className="pt-4 list-inside text-stone-800">
              <li className="flex items-start space-x-1">
                <span>•</span>
                <span>{t('click_header')}</span>
              </li>
              <li className="flex items-start space-x-1">
                <span>•</span>
                <span>{t('install_metamask')}</span>
              </li>
              <li className="flex items-start space-x-1">
                <span>•</span>
                <span>{t('get_matic')}</span>
              </li>
            </ul>
            <p className="mt-4 bgp-2  text-red-500">{t('backup_keys')} {App_Name}</p>
            <p className="mt-4 bg-yellow-200 p-2 font-bold text-red-500 text-center">{t('lose_access')}</p>

           </div>
           <div id="button_image" className={`${styles.header_bg_color} h-48 flex items-center justify-center rounded-xl px-6`}>
               <button 
               className="ml-8 p-2 font-khula font-black text-sm uppercase  text-white bg-orange-600 rounded-xl  drop-shadow-lg
               bg-gradient-to-r from-orange-500  to-red-500 hover:outline hover:outline-2 hover:outline-orange-300
               hover:outline-offset-2 pointer-events-none"> 
                   <p>{t('getmetamask')}</p>
               </button>            
           </div>
       </div>
  </>
  
  const AskforWalletConection =() =>
   <>
        <div id="connectwallet_image" className="flex items-center justify-between p-8">
          <div className="pr-8">
            <Image src='/information.svg' height={45} width={45} alt='warning' className="object-contain"/>
          </div>
            <div className="text-left pr-8">
              <p className="text-stone-900">{t('connect_wallet_prompt')}</p>
              <ul className="pt-4 list-inside text-stone-800">
                  <li className="flex items-start space-x-1">
                    <span>•</span>
                    <span>{t('click_connect_wallet')}</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span>•</span>
                    <span>{t('enter_password')}</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span>•</span>
                    <span>{t('accept_connection')}</span>
                  </li>
                </ul>
                <p className="mt-4 text-stone-800"> {t('permission_stayed')}</p>
            </div>
            <div id="button_image" className={`${styles.header_bg_color} h-48 flex items-center justify-center rounded-xl px-6`}>
                <button className="main-btn pointer-events-none"> 
                    <p>{t('connect_wallet')}</p>
                </button>            
            </div>
        </div>
   </>
      

  //****************************  main JSX ********************************************************* */

  return (
    <div id="landing-page" className="bg-gradient-to-br from-orange-100 via-slate-200 to-blue-100 ">
      {showSpinner && (
        <div className="absolute bottom-[45%] left-[45%]">
          <Spinner />
        </div>
      )}        

      { noWallet && warningFlag &&
          <ModalWindow setFlag={setWarningFlag} closeLabel={t('close')}>
            <AskforWalletInstallation />
          </ModalWindow> 
      }
      { !noWallet && warningFlag &&
        <ModalWindow setFlag={setWarningFlag} closeLabel={t('close')}>
          <AskforWalletConection />
        </ModalWindow> 
      }
      <div id="main-section" className="pt-8">
          <div id="page-header" className="mx-auto max-w-9xl px-4 sm:mt-16 lg:mt-24 text-center">
            <h1 className="text-4xl tracking-tight font-bold text-stone-900 sm:text-5xl md:text-6xl pt-4 font-khula">
              <span className="text-stone-600 bg-gradient-to-r from-orange-600 via-stone-200 to-orange-500 rounded-xl px-2">
                {`  ᑭro-pon`}
              </span>
              <span className="">{` ${t("app_title1")} `} </span>
              <span className="text-blue-700">{t("app_title2")}</span>
            </h1>
          </div>
          <div id="page-subheader" className="w-full font-inter sm:w-3/4 lg:w-1/2 mx-auto flex flex-col sm:flex-row items-center justify-around sm:my-16
                md:my-18 lg:my-24 xl:my-32 text-xl sm:text-2xl font-semibold text-stone-600 p-8 sm:p-16 shadow-lg border-t-2 border-stone-300 
                rounded-xl bg-gradient-to-r from-blue-400 via-stone-200 to-blue-300 transform transition hover:scale-105">
            <Image
              height={264}
              width={264}
              className="object-contain mb-8 sm:mb-0 mr-8 hover:rotate-3"
              src={"/blockchain.png"}
              alt="blockchain logo"
            />
            <div className="pl-8  text-justify leading-8">
              <p className="mb-8 font-bold">{t("subtitle1")}</p>
              <p className="italic">{t("subtitle2")}</p>
            </div>
          </div>
        <div id="CTA-subsection" className="sm:my-16 md:my-18 lg:my-24 xl:my-48"
         style={{boxShadow: '0px 5px 15px 0 rgba(0, 0, 0, 0.9), 0px -5px 25px 0 rgba(0, 0, 0, 0.9)'}}
        > 
            <CTA_Card />
        </div>
        <div className="w-[80%] mx-auto">
          <div id="no-signup-notice" className=" text-center p-4 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500
            rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full"
            style={{boxShadow: '0px 5px 15px 0 rgba(255, 165, 0, 0.6), 0px -5px 25px 0 rgba(255, 165, 0, 0.9)'}}>
            <p className="font-bold text-white sm:text-xl md:text-xl lg:text-3xl">
              {t('no_signup')}
            </p>
            <p className="font-inter text-white text-base sm:text-lg md:text-xl lg:text-2xl mt-2">
              {t('browse_rfp')}
            </p>
            <div className="pt-8 pb-4 text-center">
              <button className="mx-4 blueblack-btn"
                onClick={handleSearchCompanies}>
                {t('search_companies')}
              </button>
              <button className="mx-4 blueblack-btn"
                onClick={handleSearchRFP}>
                {t('search_rfps')}
              </button>
            </div>
          </div>
        </div>
        <div id="informative-intro-cards" className="sm:my-16 md:my-18 lg:my-24 xl:my-48 mx-12 pb-16">
          <div className="w-3/4 mx-auto divide-y-2 divide-gray-200">
            <ul className="mt-4 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16 grid-auto-rows p-4
             border-t-2 border-l-2 border-orange-200 rounded-lg" 
            style={{boxShadow: '5px 5px 15px 0 rgba(255, 165, 0, 0.5)'}}>
              <InfoCard
                title={t("transp_proc")}
                image={"/magnifier-lined.svg"}
                info={t("enter_new_era_of_fairness")}
              />
              <InfoCard
                title={t("pub_rfp_bc")}
                image={"/blockchain.png"}
                info={t("data_documents_fortified")}
              />
              <InfoCard
                title={t("unvel_post_rfp")}
                image={"/personsearch.svg"}
                info={t("upon_completion_of_rfp")}
              />
              <InfoCard
                title={t("build_bc_rep")}
                image={"/education-64.png"}
                info={t("create_immutable_trail")}
              />
            </ul>
          </div>
        </div>
      </div>
     
      <div
        id="second-section"
        className="mx-auto sm:my-24 md:my-32 lg:my-48 xl:my-64  font-inter sm:w-4/6 md:w-4/6 lg:w-5/6 xl:w-5/6 bg-stone-300
                    rounded-2xl  pr-8 py-8"
      >
        <div
          id="features-subsection"
          className="flex items-center  justify-end mt-12 space-y-12 lg:space-y-0 lg:gap-x-4 lg:gap-y-10  "
        >
          <div className="w-[50%] mr-32">
            <p className=" mb-8 sm:text-lg  md:text-xl lg:text-3xl xl:text-4xl font-bold text-orange-400"
            style={{textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'}}>
              {t("features_label")}
            </p>
            <ul className="ml-8 sm:text-md md:text-lg lg:text-xl xl:text-xl text-stone-800 pl-4 list-none leading-[1.2rem] mb-8">
              <li className="relative ">
                <span className="absolute left-[-1.5em] text-blue-900 text-2xl font-extrabold">
                  ‣
                </span>
                <strong>{t("global_marketplace_label")}</strong>{" "}
                {t("global_marketplace_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">
                  ‣
                </span>
                <strong>{t("digital_signing_label")}</strong>{" "}
                {t("digital_signing_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">
                  ‣
                </span>
                <strong>{t("confidentiality_label")}</strong>{" "}
                {t("confidentiality_description")}
              </li>
              <li className="relative mt-8">
                <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">
                  ‣
                </span>
                <strong>{t("traceability_label")}</strong>{" "}
                {t("traceability_description")}
              </li>
            </ul>
          </div>
          <div className="">
            <Image
              height={600}
              width={500}
              className="object-cover rounded-2xl"
              src="/propon-graphic2.jpeg"
              alt="graphic1"
            />
          </div>
        </div>
      </div>
      <div ref={resourceSectionRef}  id="resources-section" className="px-16 pt-16 sm:pb-32 md:pb-32 lg:pb-48 xl:pb-48 bg-gradient-to-bl from-blue-100 via-slate-200 to-orange-100">
        <p className="mt-12 text-center lg:text-3xl xl:text-4xl md:text-2xl sm:text-xl text-orange-500 font-bold tracking-wider"
        style={{textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'}}>
          {t("learn_more")}
        </p>
        <div
          id="resources-subsection"
          className="mt-12 flex justify-center space-x-4 items-center bg-white p-16 rounded-xl"
        >
          <div id="guide-card" className="pr-8">
            <Card
              title={t("Guides")}
              image={"/guides-propon1.png"}
              link={"https://example.com/guide"}
            />
          </div>
          <div id="blog-card" className="">
            <Card
              title={t("Blog")}
              image={"/propon-blog4.png"}
              link={"https://example.com/blog"}
            />
          </div>
          <div id="faq-card" className="pl-8">
            <Card
              title={t("FAQ")}
              image={"/faqpropon1.jpg"}
              link={"https://example.com/faq"}
            />
          </div>
        </div>
      </div>

      <footer
        id="foot-section"
        className=" bg-stone-400 text-stone-700 text-center sm:text-sm md:text-md lg:text-lg xl:text-xl font-inter"
      >
        <div
          id="polygon-arweave-logos"
          className="flex justify-center items-center"
        >
          <p className="text-white font-bold pr-4"> {t("powerby")}: </p>
          <div className="flex justify-center ">
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
              className=" object-contain"
              src="/full-arweave-logo.svg"
              alt="Arweave Logo"
            />
            <span className="w-[25px]"></span>
          </div>
        </div>
        <p className="-mt-8 pb-2 text-stone-900">{t("site_for_polygon")}</p>
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
  );
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
  };
}

export default LandingPage;
