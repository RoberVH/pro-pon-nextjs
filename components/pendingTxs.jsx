import { useEffect, useState } from "react";
import { getPendingTxStatuses } from '../web3/getTxStatus'
import { convDate } from '../utils/misc'
import { useTranslation } from "next-i18next"
import Spinner from './layouts/Spinner'


  
const PendingTxs = ({ pendingTxs, handleClearAllTxs, handleClearTx}) => {
  const [txStatuses, setTxStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation(['common', 'rfps']);
  useEffect(() => {
    const getTxStatuses = async () => {
      setIsLoading(true)
      const statuses = await getPendingTxStatuses(pendingTxs)
      console.log('status', statuses)
      setTxStatuses(statuses);
      setIsLoading(false)
    };
    getTxStatuses();
  }, [pendingTxs]);


  return (
      <div >
        <div className=" flex justify-center items-center  mb-4">
          <h2 className="text-2xl font-medium text-stone-500 mt-8 mx-auto">{t('mypending_transactions')}</h2>
          <button
            className="mt-24 mr-4 rounded-md border border-transparent shadow-sm px-4 py-1 bg-red-500 text-sm 
            font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleClearAllTxs}
          >
            {t('clean_all')}
          </button>
        </div>
        {isLoading ? <div className="mt-8 scale-50">
                         <Spinner />
                      </div>
          :
          <div>
            <div  
                  key="0001_HEADER" 
                  className="flex items-center justify-center bg-orange-200 rounded-lg py-2 mb-2 font-khula text-stone-900 text-xl font-semibold
                  shadow">
                  <div id="1rstcoltitle" className="w-[25%] mr-2 ">
                    {t('transactions.transaction_type', {ns:"rfps"})} 
                  </div>
                  <div id="2ndtcoltitle" className="w-[25%] flex items-center  ">
                    {t('issued_on')} 
                  </div>
                  <div  id="3rdcoltitle" className="w-[15%] ml-4 text-stone-700 truncate cursor-pointer hover:text-orange-700">
                    {t('transaction_hash') }
                  </div>
                  <div id="4thcoltitle" className="w-[30%] flex items-center justify-between ">
                    {t('status')}
                  </div>
            </div>
            {Boolean(txStatuses.length) && txStatuses
              .sort((a, b) => a.date - b.date)
              .map((tx) => (
                <div  
                  key={tx._id} 
                  className="flex items-center justify-center bg-orange-100 rounded-lg py-2 mb-2 font-khula text-stone-700 font-semibold shadow">
                  <div id="1rstcol" className="w-[25%] mr-2 ">
                    {t(`transactions.${tx.type}`, {ns:"rfps"})} 
                  </div>
                  <div id="2ndtcol" className="w-[25%] flex items-center  ">
                    {t('issued_on')} {convDate(tx.date)}
                  </div>
                  <div  id="3rdcol" className="w-[15%] ml-4 text-orange-500 truncate cursor-pointer hover:text-orange-700"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}/tx/${tx.txHash}`, '_blank')} 
                    title={`Tx Hash: ${tx.txHash}`}>
                    {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-6)}
                  </div>
                  <div id="4th" className="w-[30%] flex items-center justify-between ">
                    {tx.status === "pending" && (
                      <div className="text-red-700 font-bold mr-2"> PENDING {tx.status}</div>
                    )}
                    {tx.status === 1 && (
                      <div className="font-bold text-green-700  mr-2 cursor-pointer" 
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}/block/${tx.blockNumber}`, '_blank')}
                        title={`${process.env.NEXT_PUBLIC_LINK_EXPLORER}/block/${tx.blockNumber}`}>
                        {`${t('success')} Block: ${tx.blockNumber}`}
                      </div>
                    ) 
                    }
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-orange-500 text-sm 
                      font-BOLD text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      onClick={() => handleClearTx(tx._id)} >
                      {t('clean_tx')}
                    </button>
                  </div>
                </div>
            ))}
          </div>
      }
      </div>
    );
  };
  
  export default PendingTxs;
  