import React from "react";

export function SignMsgAlert({
  showSignMsg,
  msgWarning,
  signMsg,
  handleSigning,
}) {
  return (
    <div
      className={`${
        showSignMsg ? "fixed bg-zinc-100 inset-0 opacity-80 z-50 " : null
      }`}
    >
      <div
        className={`lg:fixed bottom-0 right-0 -mt-32 text-center bg-white h-[25%] w-[40%]  border-2 border-orange-600  
                        ${
                          showSignMsg
                            ? "lg:-translate-y-1/2 xl:translate-y-0"
                            : "translate-y-full"
                        } ease-in-out duration-1000`}
      >
        <div className="pt-2 pl-4 text-left">
          <p className="xl:py-4 lg:py-2 px-10 font-work-sans md:text-sm  text-black ">
            {msgWarning}
          </p>
          <div className="flex justify-center lg:mt-2 3xl:mt-6">
            <button onClick={handleSigning} className="flex main-btn md:text-xs">
              {" "}
              {signMsg}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
