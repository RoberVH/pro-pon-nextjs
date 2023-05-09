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
 
return (
  <div>
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Image height={32} width={32} className="h-8  w-auto" src="/pro-ponLogo5.svg" alt="Logo App"></Image>
                    <nav className="hidden sm:block ml-10">
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-gray-900">Companies</a>
                            <a href="#" className="text-gray-500 hover:text-gray-900">RFPs</a>
                        </div>
                    </nav>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 mr-4 hidden sm:inline">Logged Company</span>
                    <button id="connect-wallet" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
    </header>

    <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
        <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Web3 RFP</span>
                <span className="block text-indigo-600 xl:inline">Management Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Welcome to our innovative platform for managing Request for Proposals (RFPs)!
            </p>
        </div>

        <div className="mt-10">
            <div className="max-w-xl mx-auto divide-y-2 divide-gray-200">
                <ul className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
                    <li>
                        <div className="space-y-4">
                            <div className="aspect-w-3 aspect-h-2">
                            <Image height={32} width={32} className="object-cover shadow-lg rounded-lg" src="/globe-americas.svg" alt="Feature 1" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg leading-6 font-medium space-y-1">
                                    <h3 className="text-gray-900">Register RFP metadata and documentation</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="space-y-4">
                            <div className="aspect-w-3 aspect-h-2">
                            <Image height={32} width={32} className="object-cover shadow-lg rounded-lg" src="/globe-americas.svg" alt="Feature 2" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg leading-6 font-medium space-y-1">
                                    <h3 className="text-gray-900">Coordinate important events and deadlines</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="space-y-4">
                            <div className="aspect-w-3 aspect-h-2">
                            <Image height={32} width={32} className="object-cover shadow-lg rounded-lg" src="/globe-americas.svg" alt="Feature 3" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg leading-6 font-medium space-y-1">
                                    <h3 className="text-gray-900">Upload and manage RFP response documents</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="space-y-4">
                            <div className="aspect-w-3 aspect-h-2">
                            <Image height={32} width={32} className="object-cover shadow-lg rounded-lg" src="/globe-americas.svg.jpg" alt="Feature 4"></Image>
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg leading-6 font-medium space-y-1">
                                    <h3 className="text-gray-900">Provide and store legal and administrative documents</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div className="mt-16 flex justify-center">
            <button id="connect-wallet-cta" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Connect Wallet
            </button>
        </div>
    </main>
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