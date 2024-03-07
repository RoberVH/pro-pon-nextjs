/**
 * @module HeadBar
 * @description This module is used for to display the headbar for the application
 */

import styles from "../../styles/Home.module.css";
import {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import { getContractCompanyData } from "../../web3/getContractCompanyData";
import { checkMMAccounts } from "../../web3/getMetaMaskAccounts";
import { getCompanydataDB } from "../../database/dbOperations";
import { connectMetamask } from "../../web3/connectMetamask";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Menues from "../menues";
import SelectLanguage from "../header/selectLanguage";
import { proponContext } from "../../utils/pro-poncontext";
import { switchNetwork } from "../../web3/switchnetwork";
import { BadgeCheckIcon } from "@heroicons/react/outline";
import { StatusOfflineIcon } from "@heroicons/react/outline";
import DisplayMsgAddinNetwork from "./displayMsgAddinNetwork";
import NoMetamaskWarning from "./noMetamaskWarning";
import NoRightNetworkWarning from "./noRightNetworkWarning";
import { saveCompanyID2DB } from "../../database/dbOperations";

// toastify related imports
// import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";
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
  account: 2,
  language: 3,
  elsewhere: 4,
};
const demoUrlEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? process.env.NEXT_PUBLIC_VERCEL_ENV==="preview"
  : false;

const HeadBar = () => {
  const [hideMenuAccount, sethideMenuAccount] = useState(false);
  //const [noWallet, setnoWallet] = useState(true)
  const [addingNetwork, setAddingNetwork] = useState(false);
  const [droppletVisible, setdroppletVisible] = useState(false);
  // get context variables
  const {
    companyData,
    setCompanyData,
    address,
    setAddress,
    setShowSpinner,
    noRightNetwork,
    setNoRightNetwork,
    noWallet,
    setnoWallet,
  } = useContext(proponContext);

  const { t } = useTranslation(["menus", "common", "gralerrors"]);
  const router = useRouter();

  /**
   * Error Toaster Box
   * @param {String} msj Error message to show in the toaster box
   */
  const errToasterBox = (msj) => {
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
      let { id, company_RFPs, RFPsWins, RFPParticipations } = contractCiaData;
      RFPsWins = RFPsWins.map((rfp) => parseInt(rfp));
      RFPParticipations = RFPParticipations.map((rfp) => parseInt(rfp));
      company_RFPs = company_RFPs.map((rfp) => parseInt(rfp));
      const result = await getCompanydataDB(id); // get complementary company data from DB
      if (!result.status) {
        errToasterBox(t(result.msg, { ns: "gralerrors" }));
        return;
      }
      if (result.data.companyId)
        setCompanyData({
          RFPsWins,
          RFPParticipations,
          company_RFPs,
          ...result.data,
        });
      else {
        // Error, there is not a Company  DB record corresponding to found Company Id on Contract, record it to DB to sync them
        // this could be because a previous error when creating the company that didn't get into DataBase
        const { name, country } = contractCiaData;
        const result = await saveCompanyID2DB(id, name, country, address);
        if (!result.status) errToasterBox(result.msg);
        else {
          const result = await getCompanydataDB(id); // read from DB company data
          if (!result.status) {
            errToasterBox(t(result.msg, { ns: "gralerrors" }));
            return;
          }
          setCompanyData({
            RFPsWins,
            RFPParticipations,
            company_RFPs,
            ...result.data,
          }); // write db record to context with id that we'll use to update it
        }
      }
    },
    [setCompanyData, address]
  );

  // hooks  ******************************************************************************************

  // check if there is an account already granted and set a listener to MetaMask change account event
  useEffect(() => {
    const handleAccountChange = () => {
      router.push({ pathname: "/" });
      window.location.reload();
    };

    // in demo version hide the Vercel preview feedback toolbar, nasty but needed for non developers users if the preview environ is to be used for demo purposes
    document.getElementById('feedback-toolbar').style.display = 'none';
    
    let cleanupEthereumEvents;
    let cleanupMouseDown;

    // For the mousedown event
    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      cleanupMouseDown = () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    // For the Ethereum events
    if (window.ethereum) {
      setnoWallet(false); // there is Metamask or provider installed at browser
      checkMMAccounts(setAddress);
      window.ethereum.on("accountsChanged", handleAccountChange);

      cleanupEthereumEvents = () => {
        if (window.ethereum.off) {
          window.ethereum.off("accountsChanged", handleAccountChange);
        }
      };
    }

    // Cleanup functions
    return () => {
      if (cleanupEthereumEvents) {
        cleanupEthereumEvents();
      }
      if (cleanupMouseDown) {
        cleanupMouseDown();
      }
    };
  }, []);

  useEffect(() => {
    async function getDatafromContract() {
      //first check if network is rigth
      let noWorkingRightNetwork = false;
      // changed this from deprecated window.ethereum.networkVersion check https://github.com/MetaMask/metamask-improvement-proposals/discussions/23
      window?.ethereum
        ?.request({ method: "eth_chainId" })
        .then((chainId) => {
          noWorkingRightNetwork =
            process.env.NEXT_PUBLIC_NETWORK_VERSION !==
            parseInt(chainId, 16).toString();
          setNoRightNetwork(noWorkingRightNetwork);
        })
        .catch((error) => {
          setNoRightNetwork(noWorkingRightNetwork);
        });

      setNoRightNetwork(noWorkingRightNetwork);
      // if no noRightNetwork don't try to get company data
      if (noWorkingRightNetwork) return;
      // We are in the right network, now check if there is an address get current signed Company data
      if (address) {
        setShowSpinner(true);
        // get essential company data from Contract
        // Remember that in smart contract some prop ids are different than in DB
        // id changes to companyId, name changes to companyName
        const result = await getContractCompanyData(address);
        if (!result.status) {
          setShowSpinner(false);
          let msg = result.message;
          if (msg !== null && msg.includes("could not detect network"))
            msg = t("could_not_detect_network", { ns: "common" });
          errToasterBox(msg);
          return;
        }
        if (result.data.id) await getCompany(result.data);
        setShowSpinner(false);
      }
    }
    getDatafromContract();
  }, [address, getCompany, setShowSpinner, setNoRightNetwork]);

  const menusRef = useRef(null);
  const accountRef = useRef(null);
  const languageRef = useRef(null);

  // Utility functions  ****************************************************************************************
  const changeNetworks = async () => {
    const result = await switchNetwork();
    if (result.status) setNoRightNetwork(false);
    else if (result.error.code === 4902) {
      // This error code means that the chain we want has not been added to MetaMask
      // In this case we ask the user to add it to their MetaMask
      setAddingNetwork(true);
      const network =
        "0x" + parseInt(process.env.NEXT_PUBLIC_NETWORK_VERSION).toString(16);
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: network,
              chainName: process.env.NEXT_PUBLIC_NETWORK_WALLET_NAME,
              rpcUrls: [process.env.NEXT_PUBLIC_NETWORK_WALLET_RPC],
              nativeCurrency: {
                name: "Matic",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: [process.env.NEXT_PUBLIC_LINK_EXPLORER],
            },
          ],
        });
        setNoRightNetwork(false);
      } catch (error) {
        errToasterBox(error);
      } finally {
        setAddingNetwork(false);
      }
    }
  };

  // handlers functions  ****************************************************************************************
  // connect to metamask
  const handleConnect = async () => {
    const result = await connectMetamask();
    if (!result.status) {
      //const processed_error = result.message;
      errToasterBox(t(result.message, { ns: "gralerrors" }));
    } else {
      setAddress(result.address); // now address in in the context
    }
  };

  // Reset application context vars
  const handleDisconnect = async () => {
    setAddress("");
    setCompanyData({});
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
      setdroppletVisible(droppableItemEnum.menu);
    } else if (
      accountRef.current &&
      accountRef.current.contains(event.target)
    ) {
      setdroppletVisible(droppableItemEnum.account);
      if (event.target.id === "connect-button") handleConnect();
    } else if (
      languageRef.current &&
      languageRef.current.contains(event.target)
    ) {
      setdroppletVisible(droppableItemEnum.language);
    } else {
      setdroppletVisible(droppableItemEnum.elsewhere);
    }
  };

  // Inner Components  ******************************************************************************************
  const ShowAccount = forwardRef(({ isVisible }, ref) => {
    if (noWallet) {
      return null;
    }
    if (!address) {
      return (
        // no address yet, allow to connect
        <div ref={ref} id="showAccount">
          <button
            id="connect-button"
            className="text-components mt-4 p-2 mr-4 font-work-sans font-semibold   
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
    }
    // there is Address, return account menu functionality
    return (
      <div ref={ref} id="show-account" className="flex  mr-8 mb-2  h-[4rem]">
        <button
          disabled
          className="relative text-orange-600 rounded-xl px-2 my-4 bg-white border-solid border-2 border-orange-200 lg:text-xs xl:text-sm  "
          title={`${
            Boolean(address) &&
            Boolean(companyData.companyname) &&
            !companyData.profileCompleted
              ? t("p_not_completed")
              : ""
          }`}
        >
          {address.slice(0, 5)}...{address.slice(-6)}
          {Boolean(address) &&
            Boolean(companyData.companyname) &&
            !companyData.profileCompleted && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-[76%]">
                <span className="bg-red-500 text-white px-2 pt-0.5 pb-2 rounded-full text-sm">
                  !
                </span>
                <span className="absolute -top-6 right-0 transform translate-x-1/2 -translate-y-1/2"></span>
              </span>
            )}
        </button>
        <div
          id="show-account-chevron"
          className="mt-7 ml-3 hover:cursor-pointer"
        >
          <Image
            id="profile-imagebutton"
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
                            flex flex-col bg-blue-300  rounded-2xl text-stone-600
                            justify-start pt-4  space-y-2 py-2 px-2 hover:cursor-pointer"
          >
            <div
              id="show-account-profile-button"
              className="flex justify-start font-normal font-roboto  hover:bg-stone-100 hover:rounded-lg"
            >
              <BadgeCheckIcon className=" h-5 w-5 text-orange-600  mr-1 " />
              <p className="text-menus" onClick={handleProfile}>
                {t("profilemenu")}
              </p>
            </div>
            <div
              id="show-account-disconnect-button"
              className="flex justify-start font-normal font-roboto  hover:bg-stone-100 hover:rounded-lg"
            >
              <StatusOfflineIcon className=" h-5 w-5 text-orange-600  mr-1 " />
              <p className="pr-2 text-menus" onClick={handleDisconnect}>
                {t("disconnectmenu")}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  });

  ShowAccount.displayName = "ShowAccount";

  const AccountSpaceTitle = () => {
    if (noWallet)
      return (
        <div
          id="navigation"
          className=" antialiased  px-2 pt-1 pb-4 rounded-lg "
        >
          <NoMetamaskWarning
            msg={t("metamaskwarning", { ns: "common" })}
            buttontitle={t("getmetamask", { ns: "common" })}
          />
        </div>
      );
    else
      return (
        <div>
          <label className="text-menus font-roboto  text-white ">
            {companyData.companyname
              ? `${companyData.companyname}`
              : address
              ? `${t("nocompany", { ns: "common" })}`
              : `${t("noaccount", { ns: "common" })}`}
          </label>
        </div>
      );
  };

  // ******************************** Main JSX  ****************************************************************

  return (
    <nav
      id="navigation"
      className={`antialiased  pl-2 pt-4 pb-4 bg-gradient-to-b from-stone-600 to-orange-500 `}
      //className={`antialiased  pl-2 pt-4 pb-4 bg-[#1f1929] `}
    >
      {addingNetwork && (
        <div className="flex justify-center">
          <DisplayMsgAddinNetwork t={t} />
        </div>
      )}
      <div className="flex justify-between ">
        <div className="flex ml-4 -mb-2">
          <Link href="/" passHref className="">
            <div className="flex h-[3em] mt-4 cursor-pointer">
              <p
                className={`text-3xl pr-1 font-work-sans font-semibold bg-orange-400 text-blue-900 rounded-tl-xl py-2 pl-4`}
              >
                Propon
              </p>
              <p
                className={`text-3xl pl-1 font-work-sans font-semibold  pr-4 py-2  rounded-br-xl  ${styles.log_me_bg_color} `}
              >
                .me
              </p>
            </div>
          </Link>
          <Menues
            id="menues"
            ref={menusRef}
            isVisible={droppletVisible === droppableItemEnum.menu}
          />
        </div>

        <div className="mt-4 rounded-lg">
          <AccountSpaceTitle />
        </div>
        <div className="flex justify-around">
          <SelectLanguage
            id="selectLanguage"
            ref={languageRef}
            isVisible={droppletVisible === droppableItemEnum.language}
          />
          <ShowAccount
            ref={accountRef}
            isVisible={droppletVisible === droppableItemEnum.account}
          />
        </div>
      </div>
      {address && noRightNetwork && (
        <NoRightNetworkWarning t={t} changeNetworks={changeNetworks} />
      )}
      {demoUrlEnvironment && (
        <div className="flex justify-center space-x-4">
          <label className="px-8 bg-yellow-400 p-1 font-roboto">
            {t("demo_site")}
          </label>
          <Link href="https://www.propon.me" passHref>
            <button className="main-btn">{t("go_production")}</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default HeadBar;
