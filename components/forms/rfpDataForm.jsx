import { useState, useContext, useEffect} from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useContractEvent, useContractWrite } from 'wagmi'
import { ContractConfig } from '../../utils/contractsettings'
import { saveRFP2DB } from '../../database/dbOperations'
import { proponContext } from '../../utils/pro-poncontext'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";
import { InputRFPName }  from "../input-controls/InputRFPName";
import { InputDate } from "../input-controls/InputDate";
//import { saveCompanyID2DB } from '../../database/dbOperations'


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100"

const validatingFields = new Map([
  ['openDate','rfpform.opendateerror'],
  ['endReceivingDate','rfpform.endrecerror'],
  ['endDate','rfpform.enddateerror'],
])    

const LINK=`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/`

/**
 * RFPDataForm
 *    Present input form to register RFP and post it to blockchain, 
 *    Display spinners when waiting and indicartors of progress: Tx hash, block tx included
 *    Save data to DB collections RFPs when is confirmed to the blockchain (?)
*/
const RFPDataForm = () => {
  // State Variables & constants of module
  const { t } = useTranslation("rfps");

  const [waiting, setWaiting] = useState(false); 
  
  const [postedHash, setPostedHash] = useState('')
  const [block, setBlock] = useState('')
  const [rfpCreated, setrfpCreated] = useState(false)
  const [errorwriting, setError] = useState()
  const [rfpParams, setRpParams] = useState()
  

  const { values, handleChange } = useInputForm()
  const router = useRouter()
 
  const patronobligatorio = new RegExp("^(?!s*$).+");
  const patronDate= new RegExp("^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$")
  const { companyData } = useContext(proponContext);

// Function to display error msg
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
  

  useEffect(()=>{
    errToasterBox(errorwriting)
  },[errorwriting])

  

const { write, error } = useContractWrite({
  addressOrName: ContractConfig.addressOrName,
  contractInterface:  ContractConfig.contractInterface,
  chainId: ContractConfig.chainId,
  functionName: 'createRFP',
  onSuccess(data){ setPostedHash(data.hash) },
  onerror(error) { setError(error) }
})

  useContractEvent({
    addressOrName: ContractConfig.addressOrName,
    contractInterface:  ContractConfig.contractInterface,
    eventName: 'NewRFPCreated',
    listener: (event) => {
      setBlock(event[3].blockNumber)
      saveRFP2DB (rfpParams)  
      setrfpCreated(true)
    },
    once: true
  })


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

  const convertDate2UnixEpoch=(dateStr)=> {
    // date with format 'YYYY-MM-DD';
    const date = new Date(dateStr);
    console.log(date); 
    const timestampInMs = date.getTime();
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
        
  // handleCacel Drop form and go back to root address
  const handleCancel = () => {
    router.push({pathname: '/'})
  }

  // handleSave -  call Validate fields & if ok send transaction to blockchain
  const handleSave = async () => {
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
    setRpParams({
      companyId: companyData.companyId,
      companyname:companyData.companyname,
      name:trimmedValues['name'],
      openDate: dates[0] ,
      endReceivingDate:dates[1],
      endDate: dates[2]
    })
    try {
      await write({
        args: [trimmedValues['name'], dates[0], dates[1], dates[2]]})      
    } catch (error) {
      console.log("Error del server:", error);
      errToasterBox(error);
    } finally {setWaiting(false)}
  };

  
 // render of Component rfpDataForm *****************************************************
  return (
  <div id="generalsavearea">
      {/* Entry Form with buttons save & cancel */}
      <div 
        id="dataentrypanel" 
        className="container w-[45%] p-4 bg-white border-xl border-2 border-orange-200 rounded-md">
          <p className="text-gray-600 text-extrabold text-base text-xl mb-4 font-khula">
          ⌨ &nbsp;{t("recresrfpdata")}
          </p>
          <form
            action=""
            disabled={waiting || postedHash || rfpCreated}
            className="flex flex-col items-center justify-between leading-8 mb-8"
          >
            <div className="w-[50%] relative mb-4">
              <InputRFPName
                handleChange={handleChange}
                inputclasses={inputclasses}
                values={values}
                placeholder={`${t("rfpform.name")}*`}
                disable={waiting ||postedHash}
              />
            </div>
            <div className=" w-[50%] relative mb-4">
              <InputDate
                handleChange={handleChange}
                inputclasses={inputclasses}
                values={values}
                dateId={'openDate'}
                placeholder={`${t("rfpform.openDate")}*`}
                disable={waiting ||postedHash}
              />
            </div>
            <div className=" w-[50%] relative mb-4">
              <InputDate
                handleChange={handleChange}
                inputclasses={inputclasses}
                values={values}
                dateId={'endReceivingDate'}
                placeholder={`${t("rfpform.endReceivingDate")}*`}
                disable={waiting ||postedHash}
              />
            </div>
            <div className=" w-[50%] relative mb-4">
              <InputDate
                handleChange={handleChange}
                inputclasses={inputclasses}
                values={values}
                dateId={'endDate'}
                placeholder={`${t("rfpform.endDate")}*`}
                disable={waiting ||postedHash}
              />
            </div>
          </form>
          <div id="footersubpanel3">
            <div className={`py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md ${rfpCreated?'hidden':null}`}>
              <div className="mt-4 mr-10 " >
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
      <div className="container mt-6 p-4 bg-white border-2 border-stone-200 w-[70%] ">
        <div className="font-khula text-stone-700 text-base py-4 ">
          { (waiting || postedHash ) && (<p>{t('savingtoblockchainmsg')} </p> )}
          { postedHash && 
            <div>
              <p> {t('rfpessentialdataposted')} </p> 
              <div className="flex">
                <p>{t('chekhash')}</p>
                  <a
                    className=" text-blue-600 ml-3"
                    href={LINK + postedHash}
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
                          className="main-btn mt-8"
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
