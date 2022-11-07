const DisplayMsgAddinNetwork = ({t}) => (
    <div className="absolute bottom-[60%] left-[20%] ">
      <div className=" flex align-items bg-white border border-2 border-yellow-300 rounded-xl p-8">
      <div className=" m-4 text-center rounded-xl">
          <div className="">
              <div className="mx-auto  inline-block w-11 h-11
                      border-[8px] 
                      border-b-orange-200
                      border-t-stone-200
                      border-r-stone-200
                      border-l-stone-200
                      rounded-full 
                      animate-spin">
              </div>    
          </div>
      </div>
        <label className="font-khula text-2xl text-stone-800 ml-4 mt-8">
            { t('addingnetwork',{ns:"common"}) } ...
        </label>
  
      </div>
    </div>)
    export default DisplayMsgAddinNetwork