const NoRightNetworkWarning= ({t, changeNetworks}) => (
    <div className="m-4 rounded-md mx-auto bg-yellow-200 p-2 text-red-600 w-[70%]">
        <div className="flex justify-center">
          <h1 className="text-xl mt-4 font-bold text-red-600 font-khula">
                  {t('changenetwork',{ns:"common"})}
          </h1>
          <button 
            onClick={changeNetworks}
            className="mt-2 ml-8 p-2 font-khula font-black text-sm uppercase 
                      text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                      bg-gradient-to-r from-orange-500  to-red-500 
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