import { useState, useEffect, useContext } from 'react'
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { proponContext } from '../utils/pro-poncontext'
import { useAccount } from 'wagmi'
import  ConnectWallet  from '../components/connectWallet'





export default function ConnectW() {
  const [phase, setPhase] = useState(0)
  const router = useRouter()
  const {  companyData } = useContext(proponContext);
  const { isConnected } = useAccount()
  const { t } = useTranslation('signup')


  useEffect(()=>{
    if (isConnected) router.push({pathname: '/'})
  }, [isConnected, router])

  return (
  <main className=" antialiased">
    <div className="flex flex-col items-center"> 
      <div className="mt-8 text-xl font-bold font-khula text-slate-500 container mx-auto mt-8 ">
        <div id="activities-of-signup"        
        className="container h-[75%] my-8 mx-4 "
        >
          <ConnectWallet />
        </div>
      </div>
    </div>
  </main>)
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'signup'])),
    },
  }}