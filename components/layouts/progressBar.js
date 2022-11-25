

const ProgressBr = ({progress}) => 
     <div  className="mx-auto" >
        {/* <div className={`w-[${Math.round(progress / 5) * 5  }%] text-left  */}
        <div style={{width:`${progress}%`}} className={`text-right h-[1.6em] rounded-r-xl
         bg-gradient-to-t from-orange-500 via-orange-400 to-black`}>
            <label className="align-items text-[1em] text-white text-white text-bold font-bold
              pr-2 ">
                {`${progress}%`} 
            </label>
        </div>
      </div>

export default ProgressBr;