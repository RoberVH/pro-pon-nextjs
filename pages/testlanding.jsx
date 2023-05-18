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

import { useState, useEffect, useCallback, useContext, Fragment } from "react";
// import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getRFPsbyCompanyAddress } from '../web3/getRFPsbyCompanyAddress'
import RfpCards from "../components/layouts/RfpCards";
import { proponContext } from "../utils/pro-poncontext"
import Image from 'next/image'
import Spinner from "../components/layouts/Spinner"
import { Warning } from '../components/layouts/warning'
import { errorSmartContract } from "../utils/constants";


function TestLandigs() {
  const [loading, setloading] = useState(true)

  

  const { companyData, address } = useContext(proponContext);
  const { t } = useTranslation("rfps");
 
//************************************************** Inner components  *************************/
const InfoCard=({title, image, info}) => 
 <li>
    <div className="space-y-4 p-4 rounded-md  h-full">
        <div className=" flex items-center aspect-w-3 aspect-h-2 text-2xl text-orange-500">
            <Image height={32} width={32} className="" src={image} alt="Info" />
            <p className="ml-4 sm:text-lg md:mt-5 md:text-xl lg:text-2xl font-bold">{title}</p>
        </div>
        <div className="space-y-2">
            <div className="text-lg leading-6 font-medium space-y-1">
                <h3 className="text-stone-700 text-lg font-semibold font-inter">{info}</h3>
            </div>
        </div>
    </div>
  </li>

const Card = ({ title, image, linkedText, link }) => (
    <div className="text-center w-128">
      <a className="text-stone-500 text-md text-xl underline-none"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
      <Image width={400} height={500} className="object-aspect mx-auto rounded-xl mb-4" src={image} alt={title} />
      <h2 className="text-blue-700 text-2xl font-bold my-2 tracking-wider">{title}</h2>
      </a>
    </div>
  );

const ButtonsAction = () => 
    <div id="first-butttons-section" className="mx-auto w-2/5  rounded-md">
        <div id="buttons_cta" className="py-8 flex justify-center">
            <button id="connect-wallet-cta" className="main-btn">
                Connect Wallet
            </button>
            <button id="connect-wallet-cta" className="secondary-btn ml-8">
                Learn More
            </button>                
        </div>
    </div>  

  //*  main JSX ********************************************************* */

return (
 <div id="landing-page" className="bg-gradient-to-br from-orange-100 via-slate-200 to-blue-100 ">
    <div id="first-section" className="pt-8">
        <div id="page-header" className="mx-auto max-w-7xl px-4 sm:mt-16 lg:mt-24 text-center" >
                <h1 className="text-4xl tracking-tight font-bold text-stone-900 sm:text-5xl md:text-6xl pt-4 font-khula">
                    <span className=" ">RFP & tenders {' '}</span>
                    <span className=" text-blue-700 ">Blockchain Platform</span>
                </h1>
        </div>
        <div id="page-subheader" className="flex items-center mx-12 sm:mt-12 lg:mt-16 text-2xl font-bold font-inter text-justify text-stone-600 sm:text-lg 
                        md:text-xl lg:text-xl">
            <Image height={164} width={164} className="" src={'/blockchain.png'} alt="Feature 1" />
            <div className="ml-8 ">
                <p className="mb-2 ">
                Pro-pon the innovative platform  to post and respond to RFPs
                Experience a revolution in your procurement process with Pro-Pon, a state-of-the-art decentralized application (dApp) that leverages the power of Blockchain technology to redefine transparency, fairness, and efficiency.
                </p>
                <p>Our solution is not just about making RFP / tender processes transparent and fair, it is about reshaping the future of your procurement, creating new benchmarks for cost-efficiency, and instilling unwavering trust in every transaction. </p>
            </div>
        </div>
        <div id ="informative-intro-cards" className="sm:mt-12 lg:mt-16 mx-12 pb-16">
            <div className="w-3/4 mx-auto divide-y-2 divide-gray-200">
                <ul className="mt-4 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10 grid-auto-rows">
                    <InfoCard title={'Transparent Process'} image={'/magnifier-lined.svg'} info={`Enter a
                        new era of fairness in the RFP landscape thanks to Blockchain technology,. Break down the barriers of traditional siloed systems, 
                        use our  decentralized platform to ensure complete visibility and control. Every transaction, every proposal,
                        and  decision is recorded and verifiable, bringing a level of transparency that fosters trust and fairness`} />
                    <InfoCard title={'Publish Your RFPs to Blockchain'} image={'/blockchain.png'} info={`Data & Documents are not just stored, they are 
                            fortified. Encrypted and securely lodged in the Blockchain, your RFPs and tenders are immune to tampering, ensuring the integrity of 
                            your  procurement process at every step`} />
                    <InfoCard title={'Unveiling Transparency Post-RFP'} image={'/personsearch.svg'} info={`Upon completion of an RFP, Pro-Pon removes the veil. 
                        All non-sensitive documents are made accessible for auditing to incumbent stakeholders, external auditors, the Press, and the public at large. 
                        It not only underscores the integrity of your process, but also invites trust and confidence from all participants. 
                        Showcase your commitment to an open and fair procurement process, strengthening your organization's reputation. `} />
                    <InfoCard title={'Building Your Blockchain Reputation'} image={'/education-64.png'} info={`Create an immutable trail of your 
                    organization activities as you do business in the Web3 era. Each transaction contributes to a transparent record, manifesting your  commitment 
                    to integrity and fair business practices. As we navigate the digital transformation, a strong blockchain presence is  a necessity. 
                    With Pro-Pon,  you are building a trusted and verifiable Web3 reputation`} />
                </ul>
            </div>
            <p className=" sm:mt-2 lg:mt-4 font-inter text-center text-lg lg:text-xl font-bold text-blue-700 italic p-4">
                Step into the future and let your blockchain footprint tell your story  
            </p>
            <ButtonsAction />
        </div>
    </div>
    <div id="second-section" className="px-16  pb-16 py-4   font-inter ">
        <div id="features-subsection" className="flex mt-12 space-y-12 lg:space-y-0 lg:gap-x-4 lg:gap-y-10 items-center">
            <div className="w-[25%]">
                <Image height={400} width={400} className="rounded-md" src='/propon-graphic2.jpeg' alt="graphic1" />
            </div>
            <div className="w-[75%]">
                <p className="ml-4 mb-6 sm:text-lg  md:text-xl lg:text-2xl font-bold text-orange-500 ">Features: </p>
                <ul className="ml-8 sm:text-md md:text-lg lg:text-xl xl:text-xl text-stone-800 pl-8 list-none leading-[1.2rem] mb-8">
                    <li className="relative ">
                        <span className="absolute left-[-1.5em] text-blue-900 text-2xl font-extrabold">‣</span> 
                        <strong>Global Marketplace.</strong> Expand and connect your supply sources with a diverse array of sellers from around the globe, fostering a dynamic and competitive environment that brings out the best in all participants.</li>
                    <li className="relative mt-4">
                        <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">‣</span>   
                        <strong>Digital Signing. </strong>Each Document is signed with a Crypto Wallet Account: authenticity is built-in and there is non-repudiation
                                authenticity that can be verified by anyone. This makes it ideal for use in a variety of applications, such as contracts, agreements, and other legal documents.
                    <li className="relative mt-4">
                        <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">‣</span>
                        <strong>Confidentiality. </strong>   Your sensitive documents will remain confidential until the close of the RFP, ensuring a level playing field </li>
                        for all contestants..</li>
                    <li className="relative mt-4">
                        <span className="absolute left-[-1.5em] text-blue-800 text-2xl font-extrabold">‣</span>
                        <strong>Traceability</strong> All history is stored at Blockchain, not at a Silo </li>
                    
                </ul>
            </div>
        </div>
    </div>
    <div id="third-section" className="px-16 pb-16 py-4 bg-gradient-to-bl from-blue-100 via-slate-200 to-orange-100 font-khula">
        <p className="mt-12 text-center lg:text-2xl xl:text-3xl md:text-md text-orange-500 font-bold">Learn More: </p>
        <div id="resources-subsection" className="mt-12 flex justify-center space-x-4 items-center">
            <div id="guide-card" className="pr-8">
            <Card title={"Guides"} image={"/guides-propon1.png"} linkedText={"Read Guide"} link={"https://example.com/guide"} />
            </div>
            <div id="blog-card" className="">
            <Card title={"Blog"} image={"/propon-blog4.png"} linkedText={"Read Blog"} link={"https://example.com/blog"} />
            </div>
            <div id="faq-card" className="pl-8">
            <Card title={"FAQ"} image={"/faqpropon1.jpg"} linkedText={"Read FAQ"} link={"https://example.com/faq"} />
            </div>
        </div>
    </div>
    
    <footer id="foot-section" className="py-8 bg-stone-400 text-stone-700 text-center sm:text-sm md:text-md lg:text-lg xl:text-xl font-inter">
        <div id="polygon-arweave-logos" className="flex justify-center items-center">
                <p className="   pr-4"> Powered by: </p>
                <div className="flex justify-center ">
                    <Image height={130} width={130} className=" object-contain" src='/polygon_blockchain_logo.png' alt="Polygon Logo" />
                    <span className="w-[25px]"></span>
                    <Image height={130} width={130} className=" object-contain" src='/full-arweave-logo.svg' alt="Arweave Logo" />
                    <span className="w-[25px]"></span>
                </div>
        </div>
        <p className="-mt-8 text-black">
                This site is designed to interact with a smart contract on the Polygon Blockchain network and store files on Arweave Blockchain.
            </p>
            <div className="mt-4">
                <a 
                    href="/terms-of-service" 
                    className="underline text-stone-100 hover:text-stone-600" 
                    target="_blank"
                    rel="noopener noreferrer">
                        Terms of Service
                </a> | 
                <a 
                    href="/privacy-policy" 
                    className="underline text-stone-100 hover:text-stone-500 ml-2"
                    target="_blank"
                    rel="noopener noreferrer">                        
                        Privacy Policy
                </a>
            </div>
        <div className="mt-6 mb-8">
            &copy; {new Date().getFullYear()} rovicher.eth
                <a 
                    href="https://twitter.com/_propon" 
                    className=" text-stone-100 hover:text-stone-600"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                <div className="flex justify-center items-center">
                    <Image height={50} width={50} className="object-contain" alt='twitter-logo' src='/twitter-logo.svg' />
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
        "rfps",
        "common",
        "gralerrors",
        "menus",
        "companies",
      ])),
    },
  };
}

export default TestLandigs;

