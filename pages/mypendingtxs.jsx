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
import { getPendingTxStatus, historicTxs } from '../web3/getTxStatus'
import PendingTxs from "../components/pendingTxs";
import { Warning } from '../components/layouts/warning'
import Spinner from "../components/layouts/Spinner"
import { errorSmartContract } from "../utils/constants";

    // toastify related imports
    import { toastStyle } from "../styles/toastStyle";
    import { toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";



function MyPendingTransactions() {
  const [loading, setloading] = useState(true)
  const [pendingTxs, setPendingTxs] = useState([])
  const [searching, setSearching] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)


  const { t } = useTranslation("rfps");
  const { companyData, address } = useContext(proponContext);


  /******************* UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
    };

  //******************************** HOOKS   ************************************************** */
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
  const result = await removePendingTx({sender: address})
  if (result.status) {
      setPendingTxs([]);
  } else errToasterBox(result.msg) 
};

const handleClearTx = async (id) => {
    console.log('por borrar: ', id)
    const result = await removePendingTx({_id: id})
    if (result.status) {
      const updatedPendingTxs = pendingTxs.filter((tx) => tx._id !== id)
      setPendingTxs(updatedPendingTxs)
    } else errToasterBox(result.msg) 
}

  if (!address) return ( <Warning title = {t("notconnected", { ns: "common" })} />)
  if (searching) return (<div className="mt-4 border-orange-500 p-8"><Spinner /></div>)
  if (!companyData?.companyname) return ( <Warning title = {t("nocompany", { ns: "common" })} />)
  if (pendingTxs.length > 0) 
    return <div className="w-[60%] mx-auto"> 
            <PendingTxs  pendingTxs={pendingTxs} handleClearAllTxs= {handleClearAllTxs} handleClearTx={handleClearTx} />
          </div>
    else return <Warning title = {t('nopending_txs',{ns:"common"})} /> 
  }


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "menus",
        "rfps",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export default MyPendingTransactions;