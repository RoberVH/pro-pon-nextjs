/**
 * @module HeadBar
 * @description This module is used for to display the headbar for the application 
 */

import styles from '../../styles/Home.module.css'
import { useState, useContext, useEffect, useCallback, useRef } from "react";
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
import { saveCompanyID2DB } from "../../database/dbOperations"
import { PRODUCTION, LOCAL } from '../../utils/constants'


// toastify related imports
// import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from '../../styles/toastStyle'
import { toast } from "react-toastify";


/**
 * This function displays the HeadBar for the application. It contains the company logo, menus, 
 * select language, connected account and no metamask warning
 * 
 * @returns {JSX.Element}
 */

// enumeration to account what droppable menu item was clicked upon
const droppableItemEnum = {
  menu: 1,
  account:2,
  language:3,
  elsewhere:4
}

const HeadBar = () => {
  const [hideMenuAccount, sethideMenuAccount] = useState(false)
  //const [noWallet, setnoWallet] = useState(true)
  const [addingNetwork, setAddingNetwork]=useState(false)
  const [droppletVisible, setdroppletVisible] = useState(false)

// get context variables
  const {   companyData, 
            setCompanyData, 
            address, 
            setAddress,
            setShowSpinner,
            noRightNetwork,
            setNoRightNetwork,
            noWallet, 
            setnoWallet } = useContext(proponContext);

  const { t } = useTranslation(["menus", "common"]);
  const router = useRouter();
  
  /**
   * Error Toaster Box
   * @param {String} msj Error message to show in the toaster box
   */ 
  const errToasterBox =    (msj) => {
    toast.error(msj, toastStyle);
  };  
  
  /**
  * getCompany - 
  *   Destruct data from smart contract results, get rest of data from DB and merge them
  *   setCompanyData with merged data
  * 
  * @param {Object} contractCiaData Smart Contract Company data
  */

  // Callbacks functions  ******************************************************************************************
  // it gets called when loading the component and the an an a wallet account is connected and it found a Company ID registered to that
  // account in the contract. It must get the rest of the data from Database record 
  const getCompany = useCallback(
    async (contractCiaData) => {
      const {id, company_RFPs,RFPsWins ,RFPSent} = contractCiaData
      const rfpWon = parseInt(RFPsWins.length)
      const rfpSent = parseInt(RFPSent)
      const companyRFPs= company_RFPs.map(rfp => parseInt(rfp))
      const result = await getCompanydataDB(id); // get complementary company data from DB
      if (result. companyId)
          setCompanyData({rfpWon, rfpSent, companyRFPs, ...result})
      else {
        // Error, there is not a Company  DB record corresponding to found Company Id on Contract, record it to DB to sync them
          const {name, country}= contractCiaData
          const result = await  saveCompanyID2DB(id, name, country, address)
          if (!result.status)
              errToasterBox(result.msg)
              else {
              const company= await getCompanydataDB(id) // read from DB company data
              setCompanyData({rfpWon, rfpSent, companyRFPs, ...company}) // write db record to context with id that we'll use to update it                
            }
      }
    },[setCompanyData, address]);

  // hooks  ******************************************************************************************
  // check if there is an account already granted and set a listener to MMask change account event
  useEffect(() => {
    const handleAccountChange = () => {
      router.push({pathname:'/'})
      window.location.reload()
    };

    if (typeof window === "undefined") return;
    if (window.ethereum) {
        setnoWallet(false) // there is Metamask or provider installed at browser
        checkMMAccounts(setAddress)  //
        window.ethereum.on('accountsChanged', handleAccountChange);
        // return () => { window.ethereum.off('accountsChanged', handleAccountChange) }
        return () => {
          if (window.ethereum.off) { // only if window.ethereum.off exists return it
            window.ethereum.off('accountsChanged', handleAccountChange);
          }
        }
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
            // Remember that in smart contract some prop ids are different than in DB
            // id changes to companyId, name changes to companyName 
            const result = await getContractCompanyData(address) 
            if (!result.status) {
              setShowSpinner(false)
              let msg=result.message
              if (msg.includes('could not detect network')) msg=t('could_not_detect_network', { ns: "common" })
              errToasterBox(msg)
              return
            }
            if (result.data.id) 
                await getCompany(result.data)
            setShowSpinner(false)
        } 
      }
      getDatafromContract()
  },[address, getCompany, setShowSpinner, setNoRightNetwork])



  useEffect(() => {
    if (window) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const menusRef = useRef(null)
  const accountRef = useRef(null)
  const languageRef = useRef(null)


  // Utility functions  ****************************************************************************************
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

// handlers functions  ****************************************************************************************
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

  const handleClickOutside = (event) => {
     if (menusRef.current && menusRef.current.contains(event.target)) {
         setdroppletVisible(droppableItemEnum.menu)
      } else if (accountRef.current && accountRef.current.contains(event.target)) {
        setdroppletVisible(droppableItemEnum.account)
      } else if (languageRef.current && languageRef.current.contains(event.target)) {
        setdroppletVisible(droppableItemEnum.language)
      }  else {
                setdroppletVisible(droppableItemEnum.elsewhere)
      }
    };

// Inner Components  ******************************************************************************************
  const ShowAccount = ({isVisible}) => {
    if (noWallet) return null
    if (!address)
      return (
        // no address yet, allow to connect
        <div>
          <button
            className="mt-4 p-2 mr-4 font-khula font-semibold text-sm uppercase 
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
      <div ref={accountRef} id="show-account" className="flex  mr-8 mb-2" >
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
        {hideMenuAccount && isVisible && (
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
 

const AccountSpaceTitle = () => {
  if (noWallet) return (
      <nav id="navigation" className="bg-[#2b2d2e] antialiased  pl-2 pt-4 pb-4 ">
        <NoMetamaskWarning msg={t('metamaskwarning',{ns:'common'})} buttontitle={t('getmetamask',{ns:'common'})}/>
      </nav> 
  )
  else return (
      <div>
        <label className="text-xl font-semibold font-nunito text-white">
        { companyData.companyname ? `${companyData.companyname}`
        :
          address ? `${t('nocompany',{ns:'common'})}`: `${t('noaccount', {ns:'common'})}`
        }
        </label>
    </div>
  )
}

 return (
     <nav id="navigation" className={`${styles.header_bg_color} antialiased  pl-2 pt-4 pb-4 `}>
      { addingNetwork && 
        <div className="flex justify-center">
          <DisplayMsgAddinNetwork t={t}/> 
        </div>
      }
      {/* <ToastContainer style={{ width: "600px" }} /> */}
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
            </Link>
            <Menues ref={menusRef} isVisible={droppletVisible=== droppableItemEnum.menu}/>
          </div>
          <div className="mt-4">
            <AccountSpaceTitle />
          </div>
          <div className="flex justify-around">
            <SelectLanguage ref={languageRef} isVisible={droppletVisible=== droppableItemEnum.language}/>
            <ShowAccount isVisible={droppletVisible=== droppableItemEnum.account} />
          </div>
      </div>
          {(address && noRightNetwork) &&<NoRightNetworkWarning t={t} changeNetworks ={changeNetworks }/> }
    </nav>
  );
};

export default HeadBar;
