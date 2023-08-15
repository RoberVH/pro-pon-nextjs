// Modal Window to show messages
// it's displayed in the center of the screen and made the background opaque, being a modal window
// the showing flag controls is the component return somenthing

import { App_Name } from '../../utils/constants'


const ModalWindow = ({children, setFlag, closeLabel}) => 

    <div id="asking-wallet-frame" className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50 font-inter">
      <div className="fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-xl">
      <p className="bg-orange-500 text-center text-white text-lg font-semibold "> {App_Name} </p>
        {children}
      <div className="flex justify-center my-8">
            <button className="secondary-btn"
            onClick={()=>setFlag(false)}> 
                <p>{closeLabel}</p>
            </button>
        </div>      
    </div>
    </div>
export default ModalWindow