/**
 * bottomSignMsj
 *  A component to display message to user to let it know an extertnal wallet (signing) operation is about to happen
 */
import {Fragment, useState, useEffect  } from 'react'

const BottomSignMsg = ({ message, buttonAction, handleOperation}) => {

const [ showMsg, setShowMsg] = useState (false)

useEffect( ()=>{
setTimeout(()=>{showMsg(true)}, 1000)
},[])
return (
<Fragment>
  <div className="fixed bg-zinc-100 inset-0 opacity-80 z-50" >
    <div className={`fixed bottom-0 right-0 -mt-32 text-center bg-white h-[25%] w-[40%] border border-2
                     border-orange-600  
                    ${showMsg ? 'translate-y-0': 'translate-y-full'} ease-in-out duration-1000`} >
      <div className="pt-4 pl-4 text-left">
        <p className="py-8 px-10 font-khula text-xl text-black font-bold">{message}</p>
        <div className="flex justify-center" >
          <button onClick={handleOperation} className="flex main-btn"> {buttonAction}</button>
        </div>
      </div>
    </div>
  </div>
</Fragment>
)
}
export default BottomSignMsg;
