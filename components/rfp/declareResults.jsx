/**
 * DeclareResults
            Allows an RFP Issuer to declare winners for the RFP and/or individual RFP's items 
            and/or declare desserted
 * @param {*} 
 * @returns 
 */

import { useState, useEffect } from 'react'
import Image from "next/image"
import { useBidders } from '../../hooks/useBidders'
import { useDeclareResults } from '../../hooks/useDeclareResults'
import { getContractRFP }from '../../web3/getContractRFP'
import { parseWeb3Error } from '../../utils/parseWeb3Error'
import ShowTXSummary from '../rfp/ShowTXSummary'
import GralMsg from '../layouts/gralMsg'
import Spinner from '../layouts/Spinner'
const { BigNumber } = require("ethers");
import { convUnixEpoch } from '../../utils/misc'
import { nanoid } from 'nanoid'
// toastify related imports
import { toastStyle } from "../../styles/toastStyle"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { todayUnixEpoch } from "../../utils/misc"



const NullAddress='0x0000000000000000000000000000000000000000'

const DeclareResults = ({t,rfpIndex, setNoticeOff, companyId}) => {
 const [rfpRecord, setRFPRecord] = useState()
 const [inTime, setInTime]= useState(false)
 const [winners, setWinners] = useState()
 const [declaringItems, setDeclareingItems] = useState()
 // signals a button that will trigger a metamask confirm and hence a write has been clicked to disable such buttons
 // disabling them, they are 
const [actionButtonClicked, setButtonClicked] = useState(false)


  // cancel the Tx, this will save it to pending transactions DB collection
  const [isCancelled, setIsCancelled] = useState(false);
  const [droppedTx, setDroppedTx] = useState()  
  const [gettingRFP, setGettingRFP] = useState(false)
  // processingTxBlockchain flag to control when TX was send: it shows cancel transaction button on ShowTxSummary
  const [processingTxBlockchain, setProTxBlockchain] = useState(false)
  // isCollapsed flag controls displaying Declare Canceled RFP button
  const [isCollapsed, setIsCollapsed] = useState(true);
  // controls when couldn't retrieve all bidders company's data
  const [noCompaniesRetrieved, setNoCompaniesR] = useState(false);
  
 const { bidders, getBidders, companies, doneLookingBidders } = useBidders();

  /** UTILITY FUNCTIONS ************************************************************************ */
    
  const onSuccess = () => {
 //   setUpdatedRFP(true)
  };

  // Handle Error method passed unto useDeclareRsults hook
  function onError(error) {
    setButtonClicked(false)
    setProTxBlockchain(false);
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
  }  

  const errToasterBox = (msj) => {
    setButtonClicked(false)
    toast.error(msj, toastStyle);
  };

/*  Hooks ************************************************************************************** */
const { write, postedHash, block, blockchainsuccess } = useDeclareResults(onError, onSuccess, isCancelled, setProTxBlockchain);

useEffect(() => {
  async function getRFP() {
    // get info of RFP
    setGettingRFP(true)
    const result = await getContractRFP(rfpIndex);
    if (!result.status) {
      errToasterBox(result.message);
      return;
    }
    const RFP = { companyId: companyId};
    //  remove redundant numeric properties ([0]: ... [N]) from contract response & convert from Big number to
    //  number at the same time
    for (const prop in result.RFP) {
      if (isNaN(parseInt(prop))) {
        if (result.RFP[prop] instanceof BigNumber)
          RFP[prop] = result.RFP[prop].toNumber();
        else RFP[prop] = result.RFP[prop];
      }
    }
    setRFPRecord(RFP)
    setWinners(Array( RFP.items.length!=0 ? RFP.items.length: 1).fill('not_choose'))
    setDeclareingItems(RFP.items.length!=0 ? RFP.items : [`${RFP.name} - ${RFP.description}`])
    setInTime(RFP.endDate < convUnixEpoch(new Date()))
    setGettingRFP(false)
    };
    async function getBiddersInfo() {
      // obtain companies information from DataBase
      const result = await getBidders(rfpIndex);
      if (!result.status) {
        errToasterBox(result.message);
      } 
    }
  getRFP();
  getBiddersInfo();
}, []);

useEffect(()=>{
  if (companies && companies.length !== 0) {
      for (let i = 0; i < companies.length; i++) {
        if (Object.keys(companies[i]).length === 0 || 'status' in companies[i]) {
          setNoCompaniesR(true);
          errToasterBox(t('not_all_companies_retrieved') )
          break;
        }
      }
    }
} , [companies])

  /** Handling methods ************************************************************************* */
  // close showing information panel
  const handleClosePanel = () => {
      //setShowPanel(false)
      setProTxBlockchain(false)
    };
  
  /**
  *   handleCancelTx -  Record TX to PendingTx DB Collection 
  *        If TX is taking long, user can click cancel to abort waiting
  *        Tx still can go through but we won't wait for it
  */
    const handleCancelTx = () => {
    setIsCancelled(true);
    // create a copy of droppedTx object
    const updatedTxObj = { ...droppedTx };
    // update txLink property with the link value
    updatedTxObj.txHash = postedHash;
    // pass updatedTxObj to setNoticeOff function
    setNoticeOff({ fired: true, txObj: updatedTxObj });
    setProTxBlockchain(false)
  }

// save to pending transaction    
  const handleDeclareRFPCanceled = () => {
    setButtonClicked(true)
    const today = todayUnixEpoch(new Date())
    const Tx = {type: 'cancelRFP', date: today, params: [rfpRecord.rfpIndex, rfpRecord.companyId, [], true]}
    setDroppedTx(Tx)
    write(rfpRecord.rfpIndex, rfpRecord.companyId, [], true);
  } 

  // HandleDeclareRFPWinners - Record to blockchain the list of winners its position at the array corresponds with the item in RFP
  // if no items - only one winner
  // if one item . only one winner
  const handleDeclareRFPWinners = async () => {
    setButtonClicked(true)
    if (winners.includes("not_choose")) {
      errToasterBox(t('not_choose'))
      return
    }
    const today = todayUnixEpoch(new Date())
    const Tx = {type: 'declareRFP', date: today, params: [rfpRecord.rfpIndex, rfpRecord.companyId, winners, false]}
    setDroppedTx(Tx)
    write(rfpRecord.rfpIndex, rfpRecord.companyId, winners, false)
  };  

// Inner Components  ***************************************************************************************************************************
  const DespSummary = () => {
    if (processingTxBlockchain) 
      return (
          <div className="fixed inset-0  bg-zinc-100 bg-opacity-80  z-50">
            <div className="fixed  left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
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
          )
      else 
      return null
  }

// show header title of Declaring Winners
const  TitleDeclare= () => 
<div className="flex  pl-2 py-1 px-4 mb-8">
  <Image className="text-orange-400 mt-1 ml-2" alt="Proposal" src="/winnersIcon.svg" height={20} width={20} />
    <p className="font-khula ml-4 mt-2 text-md text-stone-900">
    {t("declare_winners")}
  </p>
</div>

// show/hide button to cancel the RFP frame
const CancelRFPComponent = () => {
  const handleToggleCollapsibleSection = () => { setIsCollapsed(!isCollapsed)  }
  return (
    <div id="declarecanceled-section" className="m-8 mx-auto w-[40%]">
      <div className="border border-orange-300  rounded-md shadow p-4">
        <div className="flex justify-between items-center">
          <p className="font-khula text-red-500 text-xl font-bold mb-4">
            {t('cancel_rfp_title')}
          </p>
          <div className="cursor-pointer" onClick={handleToggleCollapsibleSection}>
            {isCollapsed ? (
              <Image
                alt="V"
                src="/chevrondown2.svg"
                width={22}
                height={22}
              />
            ) : (
              <Image alt="-" src="/dash.svg" width={22} height={22} />
            )}
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex justify-center">
            <button 
              title={t('caution_cancel_rfp')} 
              onClick={handleDeclareRFPCanceled}
              disabled= {actionButtonClicked || isCancelled} // once clicked no need to click again
              className="main-btn py-2 px-4 mb-2">
              {t('cancelbutton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Display table with items and adjacent checkboxes to choose winner or declare empty (deserted) item
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
                { !noCompaniesRetrieved &&
                competitors.map((competitor) => 
                    <option key={competitor.companyId} value={competitor.address}>
                      {competitor.companyname}
                    </option>
                )}
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
    <button 
      className="main-btn" 
      disabled={actionButtonClicked || isCancelled || noCompaniesRetrieved}
      onClick={handleDeclareRFPWinners}>
        {t("record_declaration")}
    </button>
  </div>
);

/* Main JSX Module. Check pre-conditions and react accordingly *******************************************************************  */

  if (!doneLookingBidders || gettingRFP) return (
        <div className="mt-24">
          <Spinner />
        </div>
      )

if (blockchainsuccess)  return (
    <div>
      <GralMsg title = {t('transaction_succesful')} />
      <DespSummary />
    </div>
    )

if (rfpRecord.winners.length > 0 || rfpRecord.canceled ) return <GralMsg title={t('already_declared')} />

if (!inTime) return (
  <div className="mx-auto mt-8  p-4 w-[90%] border border-orange-100  shadow-md shadow-orange-100">
    <TitleDeclare />
    <CancelRFPComponent />
    <GralMsg title={`⛔ ${t('declaring_out_of_period')}`} />
    <DespSummary />
  </div>
  )


if (bidders.length === 0) return (
<div>
  <TitleDeclare />
  <CancelRFPComponent />
  <GralMsg title={t('no_participants')} />
  <DespSummary />
</div>
)

// everything clear out, so lets proceed to present components to declare winners
return (
    <div className="mx-auto mt-8  p-4 w-[90%] border border-orange-100  shadow-md shadow-orange-100">
      <TitleDeclare />
      <CancelRFPComponent />
      {isCollapsed &&
        <>
          <WinnersTable
            items={declaringItems}
            competitors={companies}
          />
          <div className="flex justify-center  mt-12 mb-8  ">
          {ButtonDeclareWinners}
          </div>
       </>
      }
      <DespSummary />
    </div>
    )
};
export default DeclareResults;


