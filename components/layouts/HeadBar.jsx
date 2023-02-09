/**
 * @module HeadBar
 * @description This module is used for to display the headbar for the application 
 */

import { useState, useContext, useEffect, useCallback } from "react";
import { getContractCompanyData } from "../../web3/getContractCompanyData"
import { checkMMAccounts } from "../../web3/getMetaMaskAccounts"
import { getCompanydataDB } from "../../database/dbOperations"
import { connectMetamask } from "../../web3/connectMetamask"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import Menues from "../menues"
import SelectLanguage from "../header/selectLanguage"
import { proponContext } from "../../utils/pro-poncontext"
import { switchNetwork } from "../../web3/switchnetwork"
import { BadgeCheckIcon } from "@heroicons/react/outline"
import { StatusOfflineIcon } from "@heroicons/react/outline"
import DisplayMsgAddinNetwork from "./displayMsgAddinNetwork"
import NoMetamaskWarning from "./noMetamaskWarning"
import NoRightNetworkWarning from "./noRightNetworkWarning"
import { PRODUCTION, LOCAL } from '../../utils/constants'
import { getDefaultProvider } from 'ethers'


// toastify related imports
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from '../../styles/toastStyle'

/**
 * This function displays the HeadBar for the application. It contains the company logo, menus, 
 * select language, connected account and no metamask warning
 * 
 * @returns {JSX.Element}
 */
const HeadBar = () => {
  const [hideMenuAccount, sethideMenuAccount] = useState(false);
  const [noMetaMask, setNoMetaMask] = useState(true);
  const [addingNetwork, setAddingNetwork]=useState(false);

  // get context variables
  const {   companyData, 
            setCompanyData, 
            address, 
            setAddress,
            setShowSpinner,
            noRightNetwork,
            setNoRightNetwork } = useContext(proponContext);

  const { t } = useTranslation(["menus", "common"]);
  const router = useRouter();
  
  const errToasterBox =
  
  /**
   * Error Toaster Box
   * @param {String} msj Error message to show in the toaster box
   */ (msj) => {
    toast.error(msj, toastStyle);
  };  
  
  /**
  * getCompany - 
  *   Destruct data from contract results, get rest of data from DB and merge them
  *   setCompanyData with merged data
  * 
  * @param {Object} contractCiaData Contract Company data
  */
  const getCompany = useCallback(
    async (contractCiaData) => {
      const {id, company_RFPs,RPFsWon,RFPSent} = contractCiaData
      const rfpWon = parseInt(RPFsWon)
      const rfpSent = parseInt(RFPSent)
      const companyRFPs= company_RFPs.map(rfp => parseInt(rfp))
      const result = await getCompanydataDB(id); // get complementary company data from DB
      setCompanyData({rfpWon, rfpSent, companyRFPs, ...result});
    },[setCompanyData]);

  // check if there is an account already granted and set a listener to MMask change account event
  useEffect(() => {

    const handleAccountChange = () => {
      console.log('Change Account!')
      router.push({pathname:'/'})
      window.location.reload()
    };

    if (typeof window === "undefined") return;
    if (window.ethereum) {
        setNoMetaMask(false) // there is Metamask or provider installed at browser
        checkMMAccounts(setAddress)  //
        window.ethereum.on('accountsChanged', handleAccountChange);
        return () => { window.ethereum.off('accountsChanged', handleAccountChange) }
      };
  }, []);

  useEffect(()=>{

    async function getDatafromContract() {
      // check if address is valir
        if (address) {
          //first check if network is rigth
          if (!LOCAL) 
             setNoRightNetwork(window.ethereum.networkVersion!==process.env.NEXT_PUBLIC_NETWORK_VERSION) 
            else {
            setNoRightNetwork(window.ethereum.networkVersion!==process.env.NEXT_PUBLIC_NETWORK_VERSION_LOCAL) 
          }
            setShowSpinner(true)
            // get essential company data from Contract
            // Remember that in contract some prop ids are different than db
            // id => companyId, name => companyName 
            const result = await getContractCompanyData(address) 
            if (!result.status) {
              setShowSpinner(false)
              errToasterBox(result.message)
              return
            }
            if (result.data.id) 
                await getCompany(result.data)
            setShowSpinner(false)
        } 
      }
      getDatafromContract()
  },[address, getCompany, setShowSpinner, setNoRightNetwork])




  const changeNetworks= async () => {
  const result= await switchNetwork()
  if (result.status) setNoRightNetwork(false)
  else if (result.error.code === 4902) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        setAddingNetwork(true)
        const network='0x'+ parseInt(process.env.NEXT_PUBLIC_NETWORK_VERSION).toString(16)
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {	
                chainId: network,
                chainName: process.env.NEXT_PUBLIC_NETWORK_WALLET_NAME,
                rpcUrls: [process.env.NEXT_PUBLIC_NETWORK_WALLET_RPC],
                nativeCurrency: {
                    name: "Matic",
                    symbol: "MATIC",
                    decimals: 18
                },
                blockExplorerUrls: [process.env.NEXT_PUBLIC_LINK_EXPLORER]
              },
            ],
          });
          setNoRightNetwork(false)
        } catch (error) {
          console.log(error);
          errToasterBox(error)
        } finally 
          { setAddingNetwork(false) }
      }    
}

// connect to metamask
  const handleConnect = async () => {
    const result= await connectMetamask()
    if (!result.status) {
        errToasterBox(t(result.message),{ns:'common'})
    } else {
        setAddress(result.address)    // now address in in the context
    }

  };

  // Reset application context vars
  const handleDisconnect = async() => {
    setAddress('')
    setCompanyData({})
    sethideMenuAccount(false);
  };

  const handleProfile = () => {
    router.push("/companyprofile"); 
    sethideMenuAccount(false);
  };

  const handleDropDownAccount = () => {
    sethideMenuAccount(!hideMenuAccount);
  };

  const ShowAccount = () => {
    if (!address)
      return (
        // no address yet, allow to connect
        <div>
          <button
            className="mt-4 p-2 mr-4 font-khula font-black text-sm uppercase 
                text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                bg-gradient-to-r from-orange-500  to-red-500 
                hover:outline hover:outline-2 hover:outline-orange-300
                hover:outline-offset-2"
            onClick={handleConnect}
          >
            {t("connect_wallet", { ns: "common" })}
          </button>
        </div>
      );
    // there is Address, return account menu functionality
    return (
      <div id="show-account" className="flex  mr-8 mb-2">

        <button
          className="text-orange-400  rounded-xl px-2 my-4 
                    bg-white border-solid border-2 border-orange-200
                    text-sm"
          onClick={handleDropDownAccount}
        >
          {address.slice(0, 5)}...{address.slice(-6)}
        </button>
        <div
          id="show-account-chevron"
          className="mt-7 ml-3 hover:cursor-pointer"
        >

          <Image
            onClick={handleDropDownAccount}
            alt="V"
            src="/chevrondown.svg"
            width={22}
            height={22}
          ></Image>
        </div>
        {hideMenuAccount && (
          <div
            id="menuAccount"
            className="absolute mt-16 ml-8  
                            flex flex-col bg-slate-200  rounded-2xl text-stone-600
                            justify-start py-2 px-2 hover:cursor-pointer"
          >
            <div
              id="show-account-profile-button"
              className="flex justify-start pb-1"
            >
              <BadgeCheckIcon className=" h-5 w-5 text-orange-600 mt-2 mr-1" />
              <p className="pt-1" onClick={handleProfile}>
                {t("profilemenu")}
              </p>
            </div>
            <div
              id="show-account-disconnect-button"
              className="flex justify-start pb-1"
            >
              <StatusOfflineIcon className=" h-5 w-5 text-orange-600  mr-1" />
              <p className="pr-2" onClick={handleDisconnect}>
                {t("disconnectmenu")}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  };
 
 if (noMetaMask) return (
    <nav id="navigation" className="bg-[#2b2d2e] antialiased  pl-2 pt-4 pb-4 ">
      <NoMetamaskWarning t={t}/>
    </nav> 
  );

 return (
     <nav id="navigation" className="bg-[#2b2d2e] antialiased  pl-2 pt-4 pb-4 ">
      { addingNetwork && 
        <div className="flex justify-center">
          <DisplayMsgAddinNetwork t={t}/> 
        </div>
      }
      <ToastContainer style={{ width: "600px" }} />
          <div className="flex justify-between">
          <div className="flex ml-4 ">
            <Link href="/" passHref>
                <a>
                <Image className="cursor-pointer object-contain mix-blend-color-dodge"
                alt="logo"
                src="/pro-ponLogo5.png"
                width={205}
                height={80}
                ></Image>
                </a>
              {/* <h1
                className="ml-2 mt-4 mb-4 bg-gradient-to-r from-[#0ac275] to-[#eb6009] 
                    text-transparent bg-clip-text text-3xl font-extrabold cursor-pointer"
              >
                ᑭᖇO-ᑭOᑎ <strong className="text-4xl">!</strong>
              </h1> */}
            </Link>
            <Menues />
          </div>
          <div className="mt-4">
            <div>
              <label className="text-xl font-semibold font-nunito text-white">
              { companyData.companyname ? `${companyData.companyname}`
              :
                address ? `${t('nocompany',{ns:'common'})}`: null
              }
              </label>
            </div>
          </div>
          <div className="flex justify-around">
            <SelectLanguage />
            <ShowAccount />
          </div>
         </div>
          {(address && noRightNetwork) &&<NoRightNetworkWarning t={t} changeNetworks ={changeNetworks }/> }
    </nav>
  );
};

export default HeadBar;
