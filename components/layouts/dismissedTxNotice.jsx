
import Image from 'next/image'
import { App_Name } from '../../utils/constants'

const DismissedTxNotice = ({notification, buttonText, setNoticeOff, dropTx, typeTx}) => 
    <div className="rounded-md shadow-md   border-2 w-[60%] h-auto border-orange-500  flex flex-col 
    justify-start bg-stone-100 ">
        <div className=" bg-orange-500 h-12 flex items-center justify-center  "> 
            <p className="text-white text-lg font-semibold "> {App_Name} </p></div>
        <div className="p-8 w-15 h-15 flex items-center justify-center ">
            <p className="text-orange-500 text-4xl font-bold" > ⓘ</p>
            <p className="flex-grow pl-8 py-4 text-left text-stone-800 text-lg font-khula"> 
                {`${notification}`}<br />
                TX: <strong> {`${typeTx} `} </strong>    
            </p>
        </div>
        <div className="flex justify-center m-4 ">
            <button className="main-btn" onClick={()=>setNoticeOff({fired:false, txArray:{}})}>
                {buttonText}
            </button>
        </div>
        <div className="h-4 bg-gradient-to-r from-orange-500 to-red-500 via-black animate-strip"></div>
    </div>
export default DismissedTxNotice;

