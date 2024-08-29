const NoRightNetworkWarning = ({ t, changeNetworks }) => (
  <div className="m-1 rounded-md mx-auto  w-[40%]  pb-2">
    <div className="flex justify-center items-center">
      <h1 className="text-sm  font-roboto bg-yellow-200 p-2 text-red-600 rounded-md">
        {process.env.NEXT_PUBLIC_VERCEL_ENV==='production' ?  t("changenetwork", { ns: "common" }) : t("changenetworktest", { ns: "common" })}
      </h1>
      <button
        onClick={changeNetworks}
        className=" ml-8 p-2 font-work-sans text-sm  
                      text-white  rounded-xl  drop-shadow-lg  
                      bg-gradient-to-r from-orange-500  to-red-600 
                      hover:outline hover:outline-2 hover:outline-orange-300 
                      hover:outline-offset-2"
        target="_blank"
        rel="noreferrer"
      >
        {process.env.NEXT_PUBLIC_VERCEL_ENV==='production' ? t("changenetworkbutton", { ns: "common" }) : t("changenetworkbuttontest", { ns: "common" })}
        {console.log('process.env.NEXT_PUBLIC_VERCEL_ENV',process.env.NEXT_PUBLIC_VERCEL_ENV)}
      </button>
    </div>
  </div>
);

export default NoRightNetworkWarning;
