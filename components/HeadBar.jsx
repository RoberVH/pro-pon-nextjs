import { useRouter } from 'next/router';
import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
// import Menues from './menues'
import SelectLanguage from './header/selectLanguage'
import { useTranslation } from "next-i18next"


const HeadBar = (props) => {
    const [address, setAddress ] = useState(false)

    function Menues() {
        const { t } = useTranslation('menus');
        return (
          <div className="text-xl font-semibold text-slate-100  uppercase mt-12 ml-16 ">
              <Link href="/companies"  >
                  <label className="mr-8 cursor-pointer decoration-orange-500 hover:text-slate-300 duration-300
                  hover:underline underline-offset-8 hover:transition-opacity  ">&nbsp;{t('companies')}&nbsp;</label>
              </Link>
      
              <Link href="/rfps">
              <label className="ml-8 cursor-pointer hover:underline  hover:text-slate-300 duration-300
              decoration-orange-500 underline-offset-8">&nbsp;{t('rfps')}&nbsp;</label>
              </Link>                
          </div>
        )
      }

    return (
        <nav className="bg-[#313435]
                        antialiased  pl-2 pt-4 pb-4 flex justify-between" >
        <div className="flex  ">
            <Link href="/" >
                <h1 className="ml-2 mt-4 mb-4 bg-gradient-to-r from-[#0ac275] to-[#eb6009] 
                text-transparent bg-clip-text text-3xl font-extrabold cursor-pointer">
                    ᑭᖇO-ᑭOᑎ <strong className="text-4xl">!</strong>
                </h1>
            </Link>
            <Menues />
        </div>
        <div className="mt-4">
            <label className=" text-xl font-semibold text-[#ff8533] "> 
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