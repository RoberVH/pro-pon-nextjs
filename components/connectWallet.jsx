import { useEffect } from 'react'
import { useConnect, useAccount } from "wagmi";

// toastify related imports
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../styles/toastStyle'


function ConnectWallet({setPhase}) {
  const { address } = useAccount()
  const {  connect, connectors, error, isLoading, pendingConnector } =  useConnect()
  const errToasterBox = (msj) => {toast.error(msj, toastStyle) }
  
  const buttonstyle="bg-orange-500 font-khula font-black text-md uppercase text-white w-[200px] rounded-xl my-4 py-2 px-4 hover:bg-stone-400 "

  useEffect(() => {
    if (error && error.message) {
      console.log('error conexion', error.message)
      errToasterBox(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (address) {
      setPhase(2) // let's got to registering company
    }
  }, [address]);


  const conectar=(indx)=> {
    connect({ connector: data.connectors.connectors[0] })
    console.log('data=', data)
    console.log('error=', error)
  }
  return (
    <div className="flex justify-center ">
       <ToastContainer style={{ width: "600px" }} autoClose={5000}  />
      <div className="bg-stone-200  px-4 border border-stone-400 rounded-xl shadow-xl 
          flex flex-col m-4 w-2/4 min-h-[350px] justify-center items-center ">
      <div className="grid grid-cols-2 divide-x-4 divide-stone-300">
        <div className=" mr-4 bg-stone-200 p-4 rounded-xl">
          <div className=""> 
            <p className="pb-4 border-b-2 border-orange-400">Conecte su Billetera</p>
            <p className=" text-stone-700 pt-4">Esta operación no va a costarle ninguna crypto moneda</p>
            <p className=" text-stone-700">Sólo necesitamos que nos dé permiso de conectarnos con la
            billetera. Mientras no se desconecte, siempre lo reconoceremos en este equipo</p>
          </div>
        </div>
        <div className="pl-12 flex flex-col">
          {connectors.map((connector) => (
            <button className={buttonstyle}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
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

export default ConnectWallet