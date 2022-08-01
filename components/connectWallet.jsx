import { useState, useEffect } from 'react'
import { useConnect, useAccount, useContractRead } from "wagmi";
import { useTranslation } from "next-i18next"


// toastify related imports
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../styles/toastStyle'

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

function ConnectWallet({setPhase}) {
  const { address } = useAccount()
  const isMounted = useIsMounted()

  const {  connect, connectors, error,  isLoading, pendingConnector } =  useConnect()
  const errToasterBox = (msj) => {toast.error(msj, toastStyle) }
  const { t } = useTranslation('signup')

  
  const buttonstyle="bg-orange-500 font-khula font-black text-md uppercase text-white w-[200px] rounded-xl my-4 py-2 px-4 hover:bg-stone-400 "

  useEffect(() => {
    if (error && error.message) {
      console.log('error conexion', error.message)
      errToasterBox(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (address) {
      setPhase(2) // let's got to registering essential data company to blockchain
    }
  }, [address]);



  return (
    <div className="container flex justify-center ">
       
      <div id="connect-panel" className="container bg-stone-100  px-4   rounded-xl shadow-xl 
          flex flex-col m-4 w-2/4 min-h-[350px] justify-center items-center 
           overflow-y-auto">
        <div className="grid grid-cols-2 divide-x-4 divide-stone-300">
          <div className=" mr-4  p-4 rounded-xl overflow-hidden shrink-0 ">
              <p className="pb-4 border-b-2 border-orange-400">{t('connecttitle')}</p>
              <p className=" text-stone-700 pt-4">{t('connectdescription1')}</p>
              <p className=" text-stone-700">{t('connectdescription2')}</p>
              <p className=" text-stone-700">{t('connectdescription3')}</p>
          </div>
          <div className="pl-12 flex flex-col">
            {connectors.map((connector) => (
              <button className={buttonstyle}
              
              disabled={isMounted ? !connector.ready : false}
              key={connector.id}
              onClick={() => connect({ connector })}
              >
                
                {/* {connector.name} */}
                {isMounted ? connector.name : connector.id === 'Injected' ? connector.id : connector.name}
                {isMounted ? !connector.ready && ' (unsupported)' : ''}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </button>
            ))}
            </div>
          </div>
      </div>
    </div>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['menus'])),
    },
  }}

export default ConnectWallet