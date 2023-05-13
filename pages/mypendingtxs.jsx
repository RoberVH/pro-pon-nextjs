/**
 * MyPendingTransactions
 *      Page to display penging Transactions of the logged Account
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      
 *      
 *      
 */

import { useState, useEffect, useCallback, useContext, Fragment } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getPendingTxs, removePendingTx }  from '../database/dbOperations'
import { proponContext } from "../utils/pro-poncontext" 
//import { getPendingTxStatus, historicTxs } from '../web3/getTxStatus'
import { useWriteFileMetadata } from '../hooks/useWriteFileMetadata'
import { parseWeb3Error } from "../utils/parseWeb3Error";
import PendingTxs from "../components/pendingTxs";
import { Warning } from '../components/layouts/warning'
import ShowTXSummary from "../components/rfp/ShowTXSummary"
import Spinner from "../components/layouts/Spinner"
import { App_Name } from '../utils/constants'
import { errorSmartContract } from "../utils/constants";

  // toastify related imports
  import { toastStyle } from "../styles/toastStyle";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";




function MyPendingTransactions() {
  const [loading, setloading] = useState(true)
  const [pendingTxs, setPendingTxs] = useState([])
  const [searching, setSearching] = useState(true)
  const [resentTxType, setresentTxType] = useState('')
  const [processingTxBlockchain, setProTxBlockchain] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false);
  const [actionButtonClicked, setButtonClicked] = useState(false)
    const [triggerSearch, setTriggerSearch] = useState(false) // A toggle flag to make  pendingTxs reading again blockchain status

  


  const { t } = useTranslation("rfps");
  const { companyData, address } = useContext(proponContext);

    
  /******************* UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, {...toastStyle});
    setButtonClicked(false)
    };

  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setProTxBlockchain(false);
    setButtonClicked(false)
  }

  async function onSuccess  (hash) {
    setTriggerSearch(prev => !prev)
  }


  //******************************** HOOKS   ************************************************** */
  const { write, postedHash, block,  blockchainsuccess } = useWriteFileMetadata(onError, isCancelled, setProTxBlockchain, onSuccess);

  useEffect(()=> {
    const getDBPendingTxs = async () => {
      if (address) {
        const result = await getPendingTxs({sender:address})
        if (result.status)  setPendingTxs(result.res)
      }
      setSearching(false)
    }
    getDBPendingTxs()
  },[address])


/* ********************* handlers *************************************************************************************/

const handleClearAllTxs  = async () => {
  setButtonClicked(true)
  const result = await removePendingTx({sender: address})
  if (result.status) {
      setPendingTxs([]);
      setButtonClicked(false)
  } else errToasterBox(result.msg) 

};

const handleClearTx = async (id) => {
    setButtonClicked(true)
    const result = await removePendingTx({_id: id})
    if (result.status) {
      const updatedPendingTxs = pendingTxs.filter((tx) => tx._id !== id)
      setPendingTxs(updatedPendingTxs)
      setButtonClicked(false)

    } else errToasterBox(result.msg) 
}
const handleRetry = async (Tx) => {
  // we send again the Tx. For now only record document metadata is implemented (type: 'filesuploadm')
  setButtonClicked(true)
  setresentTxType(Tx.type)
  await write(Tx.rfpIndex, Tx.docTypeArray, Tx.nameArray, Tx.hashArray, Tx.fileIdArray);
} 

const handleClosePanel= () => {
  setProTxBlockchain(false)  // stop showing pannel
  setButtonClicked(false)
}

const handleCancelTx = () => {
  // in this case don't do  saving Tx, just close showing pannel
  setIsCancelled(true)
  setProTxBlockchain(false)  // stop showing pannel
  setButtonClicked(false)
  setTriggerSearch(prev => !prev)  // likely the Tx is mined, doesn't hurt provoking chil pendingTxs reading again blockchain status

}

// *********************************** Inner Components  ********************************************************** */

const DismissedTxNotice = (typeTx) => 
<div className="fixed inset-0 bg-transparent z-50">
  <div  className="fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
      <div className="rounded-md shadow-md   border-2 h-auto border-orange-500  flex flex-col 
      justify-start bg-stone-100 ">
          <div className=" bg-orange-500 h-12 flex items-center justify-center  "> 
              <p className="text-white text-lg font-semibold "> {App_Name} </p></div>
          <div className="p-8 w-15 h-15 flex items-center justify-center ">
              <p className="text-orange-500 text-4xl font-bold" > ⓘ</p>
              <p className="flex-grow pl-8 py-4 text-left text-stone-800 text-lg font-khula"> 
                  {t('dropped_tx_notice')}<br />
                  TX: <strong> {t(`transactions.${resentTxType}`)} </strong>    
              </p>
          </div>
          <div className="flex justify-center m-4 ">
              <button className="main-btn" onClick={()=>setIsCancelled(false)}>
                  {t('close')}
              </button>
          </div>
          <div className="h-4 bg-gradient-to-r from-orange-500 to-red-500 via-black animate-strip"></div>
      </div>
    </div>
  </div>

// ************************************* Main Returning JSX  ****************************************************** */

  if (!address) return ( <Warning title = {t("notconnected", { ns: "common" })} />)
  if (searching) return (<div className="mt-4 border-orange-500 p-8"><Spinner /></div>)
  if (!companyData?.companyname) return ( <Warning title = {t("nocompany", { ns: "common" })} />)
  if (pendingTxs.length > 0) 
    return (
      <div>
        {isCancelled && 
        <DismissedTxNotice />

        }
        {processingTxBlockchain &&
            <div id="showsummary" className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50">
              <div className="fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <ShowTXSummary
                      postedHash={postedHash}
                      block={block}
                      t={t}
                      handleClosePanel={handleClosePanel}
                      blockchainsuccess={blockchainsuccess}
                      handleCancelTx={handleCancelTx}
                    />

              </div>
            </div>
        }        
        <div className="xl:w-[65%] lg:w-[60%] md:w-[55%] sm:w[50%] mx-auto"> 
          <PendingTxs  
              pendingTxs={pendingTxs} 
              handleClearAllTxs= {handleClearAllTxs} 
              handleClearTx={handleClearTx} 
              handleRetry={handleRetry}
              actionButtonClicked={actionButtonClicked}
              triggerSearch={triggerSearch}/>
        </div>
      </div>
      ) 
      else return <Warning title = {t('nopending_txs',{ns:"common"})} /> 
  }


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "gralerrors",
        "menus",
        "rfps",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default MyPendingTransactions;


