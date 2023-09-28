const NoRightNetworkWarning= ({t, changeNetworks}) => (
    <div className="m-1 rounded-md mx-auto  w-[40%]  pb-2">
        <div className="flex justify-center items-center">
          <h1 className="text-gl  font-bold font-khula bg-yellow-200 p-2 text-red-600 rounded-md">
                  {t('changenetwork',{ns:"common"})}
          </h1>
          <button 
            onClick={changeNetworks}
            className=" ml-8 p-2 font-khula font-black text-sm uppercase 
                      text-white  rounded-xl  drop-shadow-lg  
                      bg-gradient-to-r from-orange-500  to-red-600 
                      hover:outline hover:outline-2 hover:outline-orange-300 
                      hover:outline-offset-2" 
                      target="_blank"
                      rel="noreferrer"
                      >
                  {t('changenetworkbutton',{ns:"common"})}
          </button>
        </div>
    </div>
  )

  export default NoRightNetworkWarning