/**
 * RFPDataForm
 *    Present input form to register RFP and post it to blockchain, 
 *    Display spinners when waiting and indicartors of progress: Tx hash, block tx included
 *    Save data to DB collections RFPs when is confirmed to the blockchain (?)
*/

import { useState, useContext, useRef, useEffect} from "react"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { useWriteRFP } from "../../hooks/useWriteRFP"
import { saveRFP2DB } from '../../database/dbOperations'
import { proponContext } from '../../utils/pro-poncontext'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle"
import { toast } from "react-toastify"
import {  parseWeb3Error  } from '../../utils/parseWeb3Error'
import { getCurrentRFPPrices } from '../../web3/getCurrentContractConst'
import useInputForm from "../../hooks/useInputForm"
import { InputRFPName }  from "../input-controls/InputRFPName"
import { InputRFPDescription }  from "../input-controls/InputRFPDescription"
import { InputRFPwebsite }  from "../input-controls/InputRFPwebsite"
import { buildRFPURL } from "../../utils/buildRFPURL"


import "react-toastify/dist/ReactToastify.css";

import { InputDate } from "../input-controls/InputDate";
import RFPItemAdder from '../rfp/RFPItemAdder'


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100"

const validatingFields = new Map([
  ['openDate','rfpform.opendateerror'],
  ['endReceivingDate','rfpform.endrecerror'],
  ['endDate','rfpform.enddateerror'],
])    

const ContestType = {OPEN:0, INVITATION_ONLY:1}
const  openContest = ContestType.OPEN 
const  invitationContest = ContestType.INVITATION_ONLY


const RFPDataForm = () => {
  // State Variables & constants of module
  const { t } = useTranslation("rfps");
  const infoBoardDiv = useRef()

  const [waiting, setWaiting] = useState(false); 
  const [postedHash, setPostedHash] = useState('')
  //const [posted, setPosted] = useState('')
  const [link, setLink] = useState('')
  const [block, setBlock] = useState('')
  const [rfpParams, setRFPParams] = useState({})
  const [rfpCreated, setrfpCreated] = useState(false)
  const [items, setItems] = useState({})
  const [showItemsField, setShowItemsField] = useState(false)
  const [contestType, setContestType] = useState(openContest)

  const { values, handleChange } = useInputForm()
  const router = useRouter()
 
  const patronobligatorio = new RegExp("^(?!s*$).+");
  const { companyData } = useContext(proponContext);
  
  
  // Function to display error msg
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };



  const handleCheckItemsAdder = (e) => {
    if (Object.keys(items).length) {
      errToasterBox(t('remove_items_first'))
      e.preventDefault()
      return
    } else setShowItemsField(!showItemsField)
  }

  const saveRFPDATA2DB = async (params) => {
    const resp= await saveRFP2DB (params) 
    if (resp.status) {
      setRFPParams(rfpparams => ({...rfpparams, _id: resp._id, rfpidx:params.rfpidx}))
      toast.success(t('rfpdatasaved',toastStyleSuccess))
      setrfpCreated(true)
    } else {
      errToasterBox(resp.msg)
      setWaiting(false)
    }
  }
  
  // Handle Error method passed unto useWriteRFP hook 
  const onError = (error) => {
    const customError = parseWeb3Error(t,error)
    errToasterBox(customError)    
    setWaiting(false)
  };

  // Handle method passed unto useWriteRFP hook  to save RFP data to DB record 
  const onEvent = async (address, rfpIdx, rfpName, params) => {
    const rfpidx=parseInt(rfpIdx)
    if (!rfpCreated) {  
      const rfpparams={rfpidx,...params}
      saveRFPDATA2DB(rfpparams)
    }
  };

  const onSuccess = (data) => {
    setBlock(data.blockNumber)
  }
  
  // Set our writing hook
  const write = useWriteRFP({ onSuccess, onError, onEvent, setPostedHash, setLink})

  // Validate using regexp input fields of rfp essential data form
  const validate = (pattern, value, msj) => {
      const trimValue = (typeof value !== "undefined" ? value : "").trim();
      if (!pattern.test(trimValue)) {
        errToasterBox(msj);
        return false;
      } else {
        return true;
      }
    };


    // Receive a date with format 'YYYY-MM-DD';
  const convertDate2UnixEpoch=(dateStr)=> {
    const date = new Date(dateStr);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return unixTimestamp
    }

  const validateDate= (pattern,value,msj) =>   {
      if (typeof value==='undefined' || !pattern.test(value)) {
        errToasterBox(msj);
        return [null, false];
      } else {
        const dateUnix = convertDate2UnixEpoch(value)
        return [dateUnix, true]
      }
    }
        
  // handleCancel Drop form and go back to root address
  const handleCancel = () => {
    router.push({pathname: '/'})
  }

  // handle Edit RFP button method, Build urk with RFP params and set URL browser to that URL
  const handleEditRFP = () => {
    const params = buildRFPURL(rfpParams)
    router.push('/homerfp?' + params)    
  }

  const handleClickContestType= (e) => {
    setContestType(e.target.id ==='open' ? openContest : invitationContest)
  }

  useEffect(()=>{
    if (infoBoardDiv?.current) infoBoardDiv.current.scrollIntoView()
  },[waiting, postedHash, block])

  // handleSave -  call Validate fields & if ok send Write transaction to blockchain
  const handleSave = async () => {
    const arrayItems=Object.entries(items).map(item => item[1])
    const trimmedValues = {};
    for (let [key, value] of Object.entries(values)) {
      trimmedValues[key] = (typeof value !== "undefined" ? value : "").trim();
    }
    // validate all fields 
    // RFP name
    if (!validate(
      patronobligatorio,
      trimmedValues['name'],
      t('rfpform.namerror')
    )) return
  
    // Dates
    const dates=[]
    for (const [field, errormessage] of validatingFields) 
    {
      const [convertedDate, status ]= validateDate(
          patronobligatorio,
          trimmedValues[field],
          t(errormessage)
        )
        if (!status) return
          else dates.push(convertedDate)
    }
    if ((dates[0] >= dates[1]) || (dates[1] >= dates[2])) {
      errToasterBox(t('rfpform.datesnosequencial'))
      return
    }
    // validation passed ok 
    setWaiting(true)
    // create entry on smart contract
    // setting rfpparams for when saveing to DB time comes!
    const params =  {
      companyId: companyData.companyId,
      companyname:companyData.companyname,
      name:trimmedValues['name'],
      description:trimmedValues['description'] + '',  // in case they let it empty,
      rfpwebsite:trimmedValues['rfpwebsite'] + '',  // in case they let it empty
      openDate: dates[0] ,
      endReceivingDate:dates[1],
      endDate: dates[2],
      contestType:contestType,
      items:arrayItems
    }
    if (params.description ==='undefined') params.description=''
    if (params.rfpwebsite ==='undefined') params.rfpwebsite=''

    setRFPParams(params)
    const { openPriceRPF, invitationRFPPrice }= await getCurrentRFPPrices()
    // Different prices for RFP Type. If Open, Issuer will be paying for document uploads
    // so that price will be expensier. If Open, each bidder will paid for that. So, it should cost less
    const value= contestType === ContestType.OPEN ? openPriceRPF : invitationRFPPrice
    // writing essential RFP data to contract
    await write(
      params,
      value)
  };
  
  // Some objects to style UX
  const itemStyleContainer= {true: 'w-[85%]', false: 'w-[45%]'}
  const itemStyleInputName ={true: 'w-[85%]', false: 'w-[130%]'}
  const itemStyleDate ={true: 'w-[50%]', false: 'w-[110%]'}
  const itemStyleCheckboxText = {true: 'w-[85%]', false: 'w-[100%]'}

   

 // render of Component rfpDataForm *****************************************************
  return (
  <div id="generalsavearea">
      {/* Entry Form with buttons save & cancel */}
      <div id="dataentrypanel" 
        className={`container ${itemStyleContainer[showItemsField]} p-4 bg-white border-xl border-2 border-orange-200 rounded-md`}>
          <p className="text-gray-600 text-extrabold text-base text-xl  font-khula">
            ⌨ &nbsp;{t("recresrfpdata")}
          </p>
          <div className="grid grid-cols-2 grid-gap-1">
            <div id="essentialdatacontainer" className="flex flex-col items-left justify-between leading-8 mt-8  pl-8 ">
              <form
                action=""
                className="mb-8"
                disabled={waiting || postedHash || rfpCreated}>
                <div className={`${itemStyleInputName[showItemsField]} relative mb-4`}>
                  <InputRFPName
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    placeholder={`${t("rfpform.name")}*`}
                    disable={waiting ||postedHash}
                  />
                </div>
                <div className={`${itemStyleInputName[showItemsField]} relative mb-4`}>
                  <InputRFPDescription
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    placeholder={`${t("rfpform.description")}`}
                    disable={waiting ||postedHash}
                  />
                </div>
                <div className={`${itemStyleInputName[showItemsField]} relative mb-4`}>
                  <InputRFPwebsite
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    placeholder={`${t("rfpform.rfpwebsite")}`}
                    disable={waiting ||postedHash}
                  />                  
                </div>                
                <div className={`${itemStyleDate[showItemsField]} relative mb-4`}>
                  <InputDate
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    dateId={'openDate'}
                    placeholder={`${t("rfpform.openDate")}*`}
                    disable={waiting ||postedHash}
                  />
                </div>
                <div className={`${itemStyleDate[showItemsField]} relative mb-4`}>
                  <InputDate
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    dateId={'endReceivingDate'}
                    placeholder={`${t("rfpform.endReceivingDate")}*`}
                    disable={waiting ||postedHash}
                  />
                </div>
                <div className={`${itemStyleDate[showItemsField]} relative mb-4`}>
                  <InputDate
                    handleChange={handleChange}
                    inputclasses={inputclasses}
                    values={values}
                    dateId={'endDate'}
                    placeholder={`${t("rfpform.endDate")}*`}
                    disable={waiting ||postedHash}
                  />
                </div>
                <div className={`bg-stone-100 p-2 flex ${itemStyleDate[showItemsField]}`}>
                  <label className="text-stone-500">{t('typecontest')}</label> 
                  <br></br>
                  <div className=" ml-12 flex justify-start text-sm" >
                    <label 
                      id="open"
                      className={`mr-4 mt-1 cursor-pointer 
                        ${contestType===openContest  ? 'bg-blue-200 px-2 py-1 rounded rounded-3xl' : 'py-1'}
                        ${waiting || postedHash ? 'pointer-events-none':''}`} 
                      onClick={handleClickContestType}
                      disable={(waiting ||postedHash).toString()} >
                        {t('open').toUpperCase()} 
                    </label>
                    <label 
                      className={`mx-4 mt-1 cursor-pointer 
                        ${contestType=== invitationContest ?'bg-blue-200 px-2 py-1 rounded rounded-3xl' : 'py-1'}
                        ${waiting || postedHash ? 'pointer-events-none':''}`} type="radio" id="invitation"
                      onClick={handleClickContestType}>
                        {t('invitation').toUpperCase()}
                    </label>
                  </div>
                </div>
              <div id="optionalCheckmark" className="flex mt-8">
                <input 
                    onClick={handleCheckItemsAdder} 
                    disabled={waiting ||postedHash}
                    className="mr-4" type="checkbox" value={showItemsField}/>
                <div className={`${itemStyleCheckboxText[showItemsField]}`}>
                <p className={`text-stone-600 font-khula`}> 
                <strong>{t('optional')}&nbsp;</strong>{t('additemscheckbox')} </p>
                </div>
              </div>
              </form>
            </div>
            <div id="ItemsForm" >
                  <RFPItemAdder items={items} setItems={setItems} showItemsField={showItemsField} disable={(waiting ||postedHash)} />
            </div>

          </div>
          <div id="footersubpanel3 ">
                <div className={` mt-4 pt-4 pb-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md w-[100%]
                ${rfpCreated?'hidden':null}`}>
                  <div className="mt-4 mr-10" >
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={waiting ||postedHash}
                      className="main-btn"
                    >
                      {!waiting ? `${t("savebutton")}` : ""}
                      {waiting && (
                        <div className=" flex justify-evenly items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900">
                          </div>
                          <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={ false}
                      className="secondary-btn">
                      {t("cancelbutton")}
                    </button>
                  </div>
                </div>
            </div>
      </div>
      {/* Inferior panel to explain & display call to actions */}
      { ( waiting || postedHash) &&
      <div ref={infoBoardDiv} className="container mt-4 mb-8 p-4 bg-white border-2 border-orange-200 w-[70%] ">
        <div className="font-khula text-stone-700 text-base py-4 ">
          { (waiting || postedHash ) && (<p>{t('savingtoblockchainmsg')} </p> )}
          { postedHash && 
            <div>
              <p> {t('rfpessentialdataposted')} </p> 
              <div className="flex">
                <p>{t('chekhash')}</p>
                  <a
                    className=" text-blue-600 ml-3"
                    href={link}
                    target="_blank"
                    rel="noreferrer">
                    { (`${postedHash.slice(0,10)}...${postedHash.slice(-11)}`)}
                  </a>
              </div>
            </div>
          }
          {  block &&
            <div className="flex" >
                <p>{t('block')} </p>
                <p className="text-blue-600">&nbsp;{block}</p> 
            </div>
          }
          {  rfpCreated &&
              <div>
                    <p>{t('rfpessentialdatasaved')} </p> 
                      <div className="flex justify-center">
                          <button 
                          className="main-btn mr-8 mt-8"
                          onClick={handleEditRFP}>
                            {t('editrfp')}
                          </button>
                          <button 
                          className="main-btn ml-8 mt-8"
                          onClick={handleCancel}>
                            {t('closebutton')}
                          </button>                          
                        </div>
              </div>
          }
        </div>
      </div>}
  </div>
  );
};
export default RFPDataForm;
