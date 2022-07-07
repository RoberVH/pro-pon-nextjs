// import { useRouter } from 'next/router';
import {useState} from 'react'
import Link from 'next/link'
// import Image from 'next/image'
import Menues from './menues'
import SelectLanguage from './header/selectLanguage'
// import { useTranslation } from "next-i18next"


const HeadBar = (props) => {
    const [address, setAddress ] = useState(false)

    return (
        <nav className="bg-[#2b2d2e]
                        antialiased  pl-2 pt-4 pb-4 flex justify-between" >
        <div className="flex  ">
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
                Manufacturas de Occidente
            </label>
        </div>        
        <div className="flex justify-around">
            <SelectLanguage />
        <div className="mt-4 mr-8">
            <label className="text-white font-semibold rounded-xl p-2 
                    border-solid border-2 border-white
                   text-md">
                0x9e31...6b0
            </label>
        </div>      
        </div>

      </nav>
)
}

export default HeadBar