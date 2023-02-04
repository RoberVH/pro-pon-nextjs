//{t('loading-blockchain')}
const SpinnerBar = ({msg}) => (
  <div className="mt-4 flex justify-center items-align ">
    <p className="absolute text-white font-bold font-khula " >{msg}</p>
    <div className=" w-[40%]  bg-blue-700 rounded-tl-2xl  rounded-tr-2xl rounded-bl-2xl  rounded-br-2xl 
                  border-2 border-blue-900"
                  >
      <div className="relative h-5 flex items-center">
        <div
          className="h-1 w-6  bg-orange-200 rounded-tl-2xl  rounded-tr-2xl rounded-bl-2xl  rounded-br-2xl
          left:0 animate-blue-dot "
          ></div>
      </div>
    </div>
  </div>
);

export default SpinnerBar;
