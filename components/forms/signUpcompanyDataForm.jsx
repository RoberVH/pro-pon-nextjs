import { useState, useContext, useEffect} from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useContractWrite, useContractEvent } from 'wagmi'
import { contractAddress } from '../../utils/proponcontractAddress'
import { ethers } from 'ethers'
import proponJSONContract from '../../utils/pro_pon.json'
import { proponChainId, errorCatalog  } from '../../utils/constants'
import { proponContext } from '../../utils/pro-poncontext'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import useInputForm from "../../hooks/useInputForm";
import "react-toastify/dist/ReactToastify.css";
import { InputCompanyId } from "../input-controls/InputCompanyId";
import { InputCompanyName } from "../input-controls/InputCompanyName";
import { saveCompanyID2DB, getCompanydataDB } from '../../database/dbOperations'


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100"

/**
 * SignUpCompanyDataForm
 *    Present stepper step 2 to register essential data to smart contract form
 *    3 manage posting company data to contrat and advance stepper phase to 3
 *    if this address has already a CompanyID registered in the blockchain go to step 3
 *    to record/modify company data
*/
const SignUpCompanyDataForm = ({setPhase}) => {
  // State Variables & constants of module
  const { t } = useTranslation("signup");
  const [companyPosted, setcompanyPosted] = useState(false)
  const [companyCreated, setcompanyCreated] = useState(false)
  const [block, setBlock] = useState('')
  const [hash, setHash] = useState('')
  const [link, setLink] = useState(' ')

  const { values, handleChange } = useInputForm()
  const router = useRouter()
 
  const patronobligatorio = new RegExp("^(?!s*$).+");
  const { setcurrentCompanyData, companyData } = useContext(proponContext);

// Function to display error msg
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };
  
  useEffect(()=> {
    // if there is already a company registerd for this account let's go to perfil
    if (companyData.companyId) {
      setPhase(3)
    }
  },[companyData.companyId,setPhase])

  // Wagmi useContractWrite hook setting & definition
  const { data, isError, isLoading, write } = useContractWrite({
    addressOrName: contractAddress,
    chainId: proponChainId,
    contractInterface: proponJSONContract.abi,    
    functionName: 'createCompany',
    onError(error) {
      let customError='unknownerror'
      if (typeof error.reason!== 'undefined') 
        if (error.reason='address_already_admin')  
           if (errorSmartContract.includes(customError)) customError=errorCatalog[error.reason]  
              else customError=errorCatalog['undetermined_blockchain_error']  
      console.log('Error es', customError)
      errToasterBox(t(`errors.${customError}`))
    },
    onSuccess(data) {
      toast.success(t('signupsuccess',toastStyleSuccess))
      setHash(data.hash)
       setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${data.hash}`)
       setcompanyPosted(true)
    },
    })

    useContractEvent({
    addressOrName: contractAddress,
    contractInterface: proponJSONContract.abi,
    eventName: 'NewCompanyCreated',
    listener: async (event) => {
      setBlock(event[3].blockNumber)
      await saveCompanyData()
      const company= await getCompanydataDB(values.companyId.trim())
      console.log('company',company)
      setcurrentCompanyData(company)
      setcompanyCreated(true)
    },
    once: true
  })

  // Validate using regexp input fields of company essential data form
  const validate = (pattern, value, msj) => {
      const trimValue = (typeof value !== "undefined" ? value : "").trim();
      if (!pattern.test(trimValue)) {
        errToasterBox(msj);
        return false;
      } else {
        return true;
      }
    };

  // End showing this screen, save to context the new created company and advance to
  // next phase (3)
    const nextPhase = async () => {
      setcompanyCreated(true)
      //await saveCompanyData()
      setPhase(3)
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
    if (!validate(
        patronobligatorio,
        trimmedValues.companyId,
        t("companyform.companyIDerror")
      )) return
    if (!validate(
        patronobligatorio,
        trimmedValues.companyname,
        t("companyform.companynamerror")
      ))return;

    // validation passed ok, 
    // create entry on smart contract
    try {
      await write({
        args: [trimmedValues.companyId,trimmedValues.companyname],
        overrides: {
          value: ethers.utils.parseEther("0.0001")
        }
      })      
    } catch (error) {
      console.log("Error del server:", error);
      errToasterBox(error);
    } 
  };

  
  // Save companyId & companyname to App context
  const saveCompanyData = async () => {
    const companyID = values.companyId.trim()
    const companyNAME = values.companyname.trim()
    setcurrentCompanyData({companyId:companyID, companyname: companyNAME, profileCompleted:false})
    // company has been created at smart contract, now reflect on Mongo DB
    // and save the data we already have. Set profileCompleted DB field to false
    // so user will have to fill that later    
    await  saveCompanyID2DB(companyID, companyNAME)
  }

// render of Component
  return (
   <div id="generalsavearea" className="container w-[74%] " >
    {/* Superior panel to explain & display call to actions */}
    <div className="container p-4 bg-gray-100 border-2xl h-[50%]">
      <div className="text-xl font-khula text-stone-600 text-base py-4 ">
        {isLoading ? 
            <p>{t('savingtoblockchainmsg')} 
            </p> 
            :
            (  companyPosted ? 
                    <div className=" w-[100%]">
                      {companyPosted && 
                      <p >{t('companyessentialdataposted')} </p>
                      }

                      {companyCreated && 
                      <p className="mb-4">{t('companyessentialdatasaved')} </p>
                      }
                      <label className="mt-4">{t('chekhash')}</label>
                      <a
                        className=" text-blue-600 ml-3"
                        href={link}
                        target="_blank"
                        rel="noreferrer">
                        {hash && (`${hash.slice(0,10)}...${hash.slice(-11)}`)}
                      </a>
                      {block && <div className="flex">
                        <p className="text-base"> BlockNode: &nbsp; </p>
                        <p className="text-blue-700"> {t('block')} {block}</p>
                      </div>
                      }
                      <div className="flex justify-center">
                        <button 
                        className="main-btn mt-8"
                        onClick={nextPhase}>
                          {t('closebutton')}
                        </button>
                      </div>
                    </div>
                    :
                    <p>{t('recordingcompanylegend')} </p>
            )
        }
      </div>
    </div>
    {/* Entry Form with buttons save & cancel */}
    <div id="dataentrypanel" className="mt-4  p-4 bg-gray-100 border-2xl">
      <p className="text-gray-600 text-extrabold text-base text-xl mb-4 font-khula">
        {t("companyform.recordessentialdata")}
      </p>
      <form
        action=""
        disabled={isLoading || companyPosted || companyCreated}
        className="flex flex-col items-center justify-between leading-8 mb-8"
      >
        <div className="w-[50%] relative mb-4">
          <InputCompanyId
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyId")}*`}
            disable={companyCreated}
          />
        </div>
        <div className=" w-[50%] relative mb-4">
          <InputCompanyName
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyname")}*`}
            disable={companyCreated}
          />
        </div>
      </form>
      <div id="footersubpanel3">
        <div className={`py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md ${companyCreated?'hidden':null}`}>
          <div className="mt-4 mr-10 " >
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || companyPosted || companyCreated}
              className="main-btn"
            >
              {!isLoading ? `${t("savebutton")}` : ""}
              {isLoading && (
                <div className=" flex justify-evenly items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900"></div>
                  <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
                </div>
              )}
            </button>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={ companyPosted || companyCreated}
              className="secondary-btn">
              {t("cancelbutton")}
            </button>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
};
export default SignUpCompanyDataForm;
