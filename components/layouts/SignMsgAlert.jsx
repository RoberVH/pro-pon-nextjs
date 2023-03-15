import React from "react";

export function SignMsgAlert({
    showSignMsg,
    msgWarning,
    signMsg,
    handleSigning
  }) {
  return <div className={`${showSignMsg ? 'fixed bg-zinc-100 inset-0 opacity-80 z-50' : null}`}>
        <div className={`fixed bottom-0 right-0 -mt-32 text-center bg-white h-[25%] w-[40%]  border-2 border-orange-600  
                        ${showSignMsg ? 'translate-y-0' : 'translate-y-full'} ease-in-out duration-1000`}>
          <div className="pt-4 pl-4 text-left">
            <p className="py-8 px-10 font-khula text-xl text-black font-bold">{msgWarning}</p>
            <div className="flex justify-center">
              <button onClick={handleSigning} className="flex main-btn"> {signMsg}</button>
            </div>
          </div>
        </div>
      </div>;
}
  