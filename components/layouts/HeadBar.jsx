 import { useEffect, useContext } from 'react'
import { useAccount, useContractRead, useDisconnect } from 'wagmi'
import { contractAddress } from '../../utils/proponcontractAddress'
import proponJSONContract from '../../utils/pro_pon.json'
import Link from 'next/link'
import Image from 'next/image'
import Menues from '../menues'
import SelectLanguage from '../header/selectLanguage'
import { proponContext } from '../../utils/pro-poncontext'

// toastify related imports
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../../styles/toastStyle'



const HeadBar = () => {
    const { companyName, companyId } = useContext(proponContext);
    const { address, isConnected } = useAccount()
    const errToasterBox = (msj) => {toast.error(msj, toastStyle) }
    const {disconnect} = useDisconnect()
      

      const { data, isError, isLoading } = useContractRead({
        addressOrName: contractAddress,
        contractInterface: proponJSONContract.abi,
        functionName: 'getHunger',
      })  

      const handleDisconnection = () => {
        disconnect()
      }

useEffect( ()=> {
    function getComapny() {
    if (address) {
        console.log('Checking company data TBD')
        // ask contract if this address already is a Company Admin and get it
    }
    }
    getComapny()
},[address, companyId])


    const ShowAccount = (address) => {
        return (
            <button className="text-orange-400 font-semibold rounded-xl px-2 pb-2
                    bg-white border-solid border-2 border-orange-200
                    text-md leading-4 "
                    onClick={() => handleDisconnection()}>
                    {address.slice(0,5)}...{address.slice(-6)}
                    &nbsp;&nbsp;
                    <span className="mt-2">
                    <Image  alt="V" src={'/chevrondown.svg'} width={22} height={22}></Image>                
                    </span>
            </button>        
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
                <div className="mt-4 mr-8">
                    { isConnected &&
                    <button className="text-orange-400 font-semibold rounded-xl px-2 pb-2
                        bg-white border-solid border-2 border-orange-200
                        text-md leading-4 "
                        onClick={() => disconnect()}>
                        {address.slice(0,5)}...{address.slice(-6)}
                        &nbsp;&nbsp;
                        <span className="mt-2">
                        <Image  alt="V" src={'/chevrondown.svg'} width={22} height={22}></Image>                
                        </span>
                    </button>     
                    }
            </div>      
            </div>
        </div>
      </nav>
)
}

export default HeadBar