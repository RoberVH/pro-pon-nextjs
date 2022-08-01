 import { useState, useContext } from 'react'
import { useAccount, useContractRead, useDisconnect } from 'wagmi'
import  useGetCompanyData from '../../hooks/useGetCompanyData'
import { useTranslation } from "next-i18next"
import Link from 'next/link'
import Image from 'next/image'
import Menues from '../menues'
import SelectLanguage from '../header/selectLanguage'
import { proponContext } from '../../utils/pro-poncontext'
import { BadgeCheckIcon } from '@heroicons/react/outline'
import { StatusOfflineIcon } from '@heroicons/react/outline'


// toastify related imports
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../../styles/toastStyle'



const HeadBar = () => {
    const [hideMenuAccount, sethideMenuAccount]= useState(false)
    const { companyName } = useContext(proponContext)
    const { address, isConnected } = useAccount()
        const { t } = useTranslation('menus');
    const errToasterBox = (msj) => {toast.error(msj, toastStyle) }
    const {disconnect} = useDisconnect()
      
    useGetCompanyData()  // disable meanwhile testing

    const handleDisconnection = () => {
        disconnect()
      }

      const handleProfile = () => {

      }
      const handleDropDownAccount = () => {
        sethideMenuAccount(!hideMenuAccount)
      }
 


    const ShowAccount = () => {
        if ( !isConnected  )  return null
        return (
            <div id="show-account" className="flex  mr-8 mb-2">
                <button className="text-orange-400  rounded-xl px-2 my-4 
                                    bg-white border-solid border-2 border-orange-200
                                    text-sm"
                        onClick={handleDropDownAccount}>
                        {address.slice(0,5)}...{address.slice(-6)}
                </button>        
                <div id="show-account-chevron" className="mt-7 ml-3 hover:cursor-pointer">
                    <Image 
                        onClick={handleDropDownAccount}
                        alt="V" src='/chevrondown.svg' width={22} height={22}>
                    </Image>                
                </div>
                { hideMenuAccount &&
                    <div id='menuAccount' className="absolute mt-16 ml-8  
                            flex flex-col bg-slate-200  rounded-2xl text-stone-600
                            justify-start py-4 px-2 hover:cursor-pointer"
                    >
                          <div id="show-account-disconnect-button" 
                                    className="flex justify-start">
                            <StatusOfflineIcon className=" h-5 w-5 text-orange-600  mr-1" />
                            <p className="pr-2" onClick={handleDisconnection}>
                                {t('disconnectmenu')}
                            </p>
                          </div>
                          <div id="show-account-profile-button" className="flex justify-start">
                            <BadgeCheckIcon className=" h-5 w-5 text-orange-600 mt-2 mr-1" />
                            <p className="pt-2" onClick={handleProfile}>{t('profilemenu')}</p>
                          </div>
                    </div>
                }
            </div>
        )
    }; 

    return (
    <nav id='navigation' className="bg-[#2b2d2e] antialiased  pl-2 pt-4 pb-4 " >
        <ToastContainer style={{ width: "600px" }}   />
        <div className="flex justify-between">
            <div className="flex ml-4 ">
                <Link href="/" passHref>
                    <h1 className="ml-2 mt-4 mb-4 bg-gradient-to-r from-[#0ac275] to-[#eb6009] 
                    text-transparent bg-clip-text text-3xl font-extrabold cursor-pointer">
                        ᑭᖇO-ᑭOᑎ <strong className="text-4xl">!</strong>
                    </h1>
                </Link>
                <Menues />
            </div>
            <div className="mt-4">
                <label className=" text-xl font-semibold font-nunito text-white ">
                 {companyName} 
                </label>
            </div>        
            <div className="flex justify-around">
                <SelectLanguage />
                <ShowAccount  /> 
            </div>
        </div>
    </nav>
)
}

export default HeadBar