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
import { BadgeCheckIcon } from "@heroicons/react/outline"
import { StatusOfflineIcon } from "@heroicons/react/outline"

// toastify related imports
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from '../../styles/toastStyle'


const NoMetamaskWarning= ({t}) => (
    <div className="font-bold text-orange-300 font-khula flex justify-center pt-2 pb-6">
        <h1 className="text-xl mt-2">{t('metamaskwarning',{ns:"common"})}</h1>
        <Link href={"https://metamask.io/download/"} passHref>
            <a className="ml-8 p-2 font-khula font-black text-sm uppercase 
                    text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                    bg-gradient-to-r from-orange-500  to-red-500 
                    hover:outline hover:outline-2 hover:outline-orange-300
                    hover:outline-offset-2" 
                    target="_blank"
                    rel="noreferrer"
                    >
                Metamask
            </a>
        </Link>
    </div>
)


const HeadBar = () => {
  const [hideMenuAccount, sethideMenuAccount] = useState(false);
  const [noMetaMask, setNoMetaMask] = useState(true);
  
  const {   companyData, 
            setCompanyData, 
            address, 
            setAddress,
            setShowSpinner } = useContext(proponContext);
  const { t } = useTranslation(["menus", "common"]);
  const router = useRouter();
  
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };  
  const getCompany = useCallback(
    async (id) => {
      const result = await getCompanydataDB(id); // get complementary company data from DB
      setCompanyData(result);
    },[setCompanyData]);

useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.ethereum) {
        setNoMetaMask(false)
        return
    } else checkMMAccounts(setAddress)
}, [setAddress]);

useEffect(()=>{
  // get company data from contract. If there is one, set companyData to DB record
  // don't do nothing otherwise
  // is only call when address has changed
    async function getDatafromContract() {
        if (address) {
            setShowSpinner(true)
            // get essential company data from Contract
            // Remember that in contract some prop ids are different than db
            // id => companyId, name => companyName 
            const result = await getContractCompanyData(address) 
            console.log('result', result.data.id)
            if (!result.status) {
              setShowSpinner(false)
              errToasterBox(result.message)
              return
            }
            if (result.data.id) 
                await getCompany(result.data.id)
            setShowSpinner(false)
        } 
    }
    getDatafromContract()
},[address, getCompany, setShowSpinner])

// connect to metamask
  const handleConnect = async () => {
    //router.push('/connectwallet') remove connectWallet page & component
    const result= await connectMetamask()
    if (!result.status) {
        errToasterBox(t(result.message),{ns:'common'})
    } else {
        setAddress(result.address)
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
      // !isConnected coming from useAccount wagmi
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

  return (
     <nav id="navigation" className="bg-[#2b2d2e] antialiased  pl-2 pt-4 pb-4 ">
      <ToastContainer style={{ width: "600px" }} />
      {noMetaMask ? 
         (<NoMetamaskWarning t={t}/>) 
        : 
         (
         <div className="flex justify-between">
          <div className="flex ml-4 ">
            <Link href="/" passHref>
                <a>
                <Image className="cursor-pointer"
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
        )}
    </nav>
  );
};

export default HeadBar;
