/**
 * DeclareResults
            Allows an RFP Issuer to declare winners for the RFP and/or individual RFP's items 
            and/or declare desserted
 * @param {*} 
 * @returns 
 */

import { useState, useEffect } from 'react'
import Image from "next/image";
import { useBidders } from '../../hooks/useBidders';
import { useDeclareResults } from '../../hooks/useDeclareResults'
import { parseWeb3Error } from '../../utils/parseWeb3Error'
import { getContractWinners } from '../../web3/getContractWinners';
import ShowTXSummary from '../rfp/ShowTXSummary'
import GralMsg from '../layouts/gralMsg'
import Spinner from '../layouts/Spinner'
import SpinnerBar from '../layouts/SpinnerBar'
import { convUnixEpoch } from '../../utils/misc';
import { nanoid } from 'nanoid'
// toastify related imports
import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NullAddress='0x0000000000000000000000000000000000000000'

const DeclareResults = ({t,rfpRecord}) => {
 const [inTime, setInTime]= useState(false)
 // if not items, make array of winners of just 1 element, otherwise make it as big as items there are
 const [winners, setWinners] = useState(Array(
    rfpRecord.items.length!=0 ? rfpRecord.items.length: 1).fill('not_choose')
  )
  // declaringItems is used to display all items, in case there is no Items use name and description of RFP
 const [declaringItems] = useState(
    rfpRecord.items.length!=0 ? rfpRecord.items : [`${rfpRecord.name} - ${rfpRecord.description}`]
  )
 const { bidders, getBidders, companies, doneLookingBidders } = useBidders();
// Flags & vars  to manage/show blockchain uploading data
const [error, setError] = useState(false)
const [sendingBlockchain, setsendingBlockchain] = useState(false)
const [showPanel, setShowPanel] = useState(false)  

  /** UTILITY FUNCTIONS ************************************************************************ */
    
  const onSuccess = () => {
    setsendingBlockchain(false);
  };

  // Handle Error method passed unto useDeclareRsults hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setsendingBlockchain(false);
  }  

  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
  };

  /** Handling methods ************************************************************************* */
  const handleClosePanel = () => {
    setShowPanel(false);
  };
  
  const handleDeclareWinners = async () => {
    if (winners.includes("not_choose")) {
      errToasterBox(t('not_choose'))
      return
    }
    setShowPanel(true);
    setsendingBlockchain(true)
    write(rfpRecord.rfpIndex, rfpRecord.companyId, winners);
  
  };  

/*  Hooks ************************************************************************************** */
const { write, postedHash, block, link, blockchainsuccess } = useDeclareResults(onError, onSuccess);

useEffect(() => {
  async function getBiddersInfo() {
    // obtain companies information from DataBase
    const result = await getBidders(rfpRecord.rfpIndex);
  
    if (!result.status) {
      errToasterBox(result.message);
    } // trigger document metadata search on useFilesRFP
  }
  getBiddersInfo();
}, []);

useEffect(()=>{
  setInTime(rfpRecord.endDate < convUnixEpoch(new Date()))
},[])



// Inner Components  ***************************************************************************************************************************
const  TitleDeclare= () => 
<div className="flex  pl-2 py-1 px-4 mb-8">
  <Image className="text-orange-400 mt-1 ml-2" alt="Proposal" src="/winnersIcon.svg" height={20} width={20} />
    <p className="font-khula ml-4 mt-2 text-md text-stone-900">
    {t("declare_winners")}
  </p>
</div>



const WinnersTable = ({ items, competitors }) => {

  // mutate the user selected value 
    const handleChange = (e, index) => {
      const newWinners = [...winners];
      newWinners[index] = e.target.value;
      setWinners(newWinners);
    };

  return (
    <table className="mb-4 table-fixed font-khula mx-auto ">
      <thead>
        <tr className="">
            <th className="w-3/5 px-2 py-2 border border-orange-300 ">{t('item')}</th>
            <th className="w-2/5 px-4 py-2 border border-orange-300">{t('winner')}</th>
        </tr>
        </thead>
      <tbody className="">
      {items.map((item,index) => (
          <tr key={nanoid()} className="">
            <td className="px-4 py-2 border border-orange-300">{item}</td>
            <td className="px-4 py-2 text-center border border-orange-300">
              <select
                className="mx-auto block w-full bg-stone-100 border rounded-md "
                value={winners[index]}
                onChange={(e)=>handleChange(e,index)}
              >
                <option value={'not_choose'}>{t('choose')}</option>
                <option value={NullAddress}>{t('deserted_items')}</option>
                {competitors.map((competitor) => (
                  <option key={competitor.companyId} value={competitor.address}>
                    {competitor.companyname}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ButtonDeclareWinners = (
  <div className="mt-2 mb-2 flex  pt-4 pl-4 pr-4  justify-center items-center">
    <button className="main-btn" onClick={handleDeclareWinners}>
      {!sendingBlockchain ? 
            `${t("record_declaration")}` 
            : 
            <div className=" flex justify-evenly items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900">
              </div>
              <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
            </div>
      }
    </button>
    {sendingBlockchain &&
      <button className="main-btn ml-16">{t("cancelbutton")}</button>
    }
  </div>
);

/* Main Module. Check pre-conditions and react accordingly *******************************************************************  */

if (rfpRecord.canceled) return <GralMsg title={t('cancel_notice')} />
if (rfpRecord.winners.length > 0) return <GralMsg title={t('already_declared')} />
//depurando, descomentar linea
//if (!inTime) return <GralMsg title={`⛔ ${t('declaring_out_of_period')}`} />
if (rfpRecord.participants.length === 0) return <GralMsg title={t('no_participants')} />
if (!doneLookingBidders) return (
      <div className="mt-24">
        <Spinner />
      </div>
    )
// everything clear out, so lets proceed to declare winners
return (
    <div className="mx-auto mt-8  p-4 w-[90%] border border-orange-100  shadow-md shadow-orange-100">
      <TitleDeclare />
        <WinnersTable
                items={declaringItems}
                competitors={companies}
        />
        <div className="flex justify-center  mt-12 mb-8  ">
        {ButtonDeclareWinners}
        </div>
        {showPanel && (
            <div className="mx-auto mt-4 mb-8 py-1 w-[90%] bg-white border rounded-md border-orange-300 border-solid shadow-xl  ">
              <div className=" font-khula text-base py-4 pl-2">
                <ShowTXSummary
                  postedHash={postedHash}
                  link={link}
                  block={block}
                  t={t}
                  handleClosePanel={handleClosePanel}
                />
              </div>
              { sendingBlockchain &&
              <div className="mb-4 ">
                <SpinnerBar msg={t('loading_data')} />
                </div>
              }
            </div>
          )}
    </div>
    )
};
export default DeclareResults;


