import { useState, useEffect, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { proponContext } from '../utils/pro-poncontext'
import NoConnectedWarning from "../components/layouts/NoConnectedWarning"
import DismissedTxNotice from "../components/layouts/dismissedTxNotice";
import { savePendingTx } from "../database/dbOperations";
import  RFPDataForm  from '../components/forms/rfpDataForm'
import { toastStyle } from "../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseWeb3Error } from "../utils/parseWeb3Error";


function Createrfps() {
  const { companyData, address } = useContext(proponContext)
  const [noticeOff, setNoticeOff] = useState({ fired: false, tx: null })

   const { t } = useTranslation(["rfps", "common","gralerrors"]);

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
 
  // hooks **************************************
  //save to DB pending Transactions
  useEffect(() => {
    const saveDBPendingTx = async () => {
      if (noticeOff.fired) {
        const result= await savePendingTx({...noticeOff.txObj, sender:companyData.address})   // Pass the object and add who issued the Tx
        if (!result.status) {
          const msgErr=parseWeb3Error(t,{message:result.msg})
          errToasterBox(msgErr)
        } else {
          // notify Tx was saved
          toast.success(t('pendingtxsaved'))
        }
      }
    };
    saveDBPendingTx();
  }, [noticeOff.fired]);

  
 

  //* Inner components   ************************************************************
  
  // If not Logged In display warning sign
  if (!address) 
    return (
      <div id="signup-screen" className="h-screen flex flex-col items-center">
        <NoConnectedWarning msj= {t('notconnected',{ns:"common"})} />
      </div>      
    )  
  if (typeof companyData.companyId==='undefined') 
    return (
      <div id="signup-screen" className="h-screen flex flex-col items-center">
        <NoConnectedWarning msj= {t('onlyregisteredtoRFP',{ns:"rfps"})} />
      </div>
    )
  // all Ok, allow create RFP screen
  return (
    // Logged In, display create RFP screen
    <div id="createrfps" className="mt-4">
        {noticeOff.fired && (
          <div className="fixed inset-0 bg-transparent z-50">
            <div className=" absolute top-[30%] left-[30%] ">
              <DismissedTxNotice
                notification={t("dropped_tx_notice")}
                buttonText={t("accept")}
                setNoticeOff={setNoticeOff}
                dropTx={noticeOff.txObj}
                typeTx = {t(`transactions.${noticeOff.txObj.type}`)}
              />
            </div>
          </div>
        )}      
      <RFPDataForm  setNoticeOff={setNoticeOff}/>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "menus",
        "rfps",
        "gralerrors"
      ])),
    },
  };
}

export default Createrfps;
