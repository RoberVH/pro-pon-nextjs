import React, { useState } from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";
import { useAccount } from 'wagmi'
import SequenceMarquee from '../components/layouts/sequenceMarquee'
import ConnectWallet  from '../components/connectWallet';
import CompanyDataForm from '../components/companyDataForm'


/**
 * Signup - Page that allows to connect and Sign Up a Company 
 *          It consist of two steps, the steps are tracked by state var phase
 *          Phase:
 *               1 - connecting wallet
 *               2 - registering Company Data
 *               3 - Succesfully finnished signing up - display adquired data
 */
function Signup() {
    const [phase,setPhase] = useState(1)
    const phasetextsstyle = "mt-2 -ml-2"
    const separator = '-'.repeat(75)
    const { locale } = useRouter()
    const { t } = useTranslation()
    const { address } = useAccount()
    
    const ConecctAndRegister=({phase})=>{
        switch (phase) {
            case 1:
                return(
                    <ConnectWallet setPhase={setPhase}/>
                )
            case 2:
                return (
                    <div className="flex justify-center">
                        <CompanyDataForm />
                    </div>
                )
            case 3:
                return (
                    <div>Todo OK finalizar</div>
                )
            default: 
            return (
                <div>no leyo nada</div>
            )
        }
   
    }

  return (
    <div className="h-screen flex flex-col items-center">
        <div id="sequencecontainer" className="w-3/4 h-[75%] m-8 border-2 border-solid 
            bg-white border-slate-200 shadow-lg rounded-xl">
            <div className="mt-8 flex flex-row justify-center">
                <SequenceMarquee phaseNumber={1} phase={phase} phaseText={'Contacto'}/>
                <p className="text-stone-300 font-bold mx-8">  {separator}   </p>
                <SequenceMarquee phaseNumber={2} phase={phase} phaseText={'Registrar'}/>
                <p className="text-stone-300 font-bold mx-8">  {separator}   </p>
                <SequenceMarquee phaseNumber={3} phase={phase} phaseText={'Terminar'}/>
            </div>
            <div className="mt-12 m-10  flex justify-center">
                <p>AQUI va el progress bar isloading </p>
            </div>
            <div>
                <ConecctAndRegister phase={phase}/>
            </div>
        </div>
     </div>
  )
}
export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common','menus'])),
      },
    }}

export default Signup