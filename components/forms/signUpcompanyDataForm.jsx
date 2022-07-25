import { useState, useContext} from "react";
import { useTranslation } from "next-i18next";
import { Link } from 'next/link'
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


const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100"

/**
 * SignUpCompanyDataForm
 *    Present stepper step 2 to register essential data to smart contract form
 *    3 manage posting company data to contrat and advance stepper phase to 3
*/
const SignUpCompanyDataForm = ({setPhase}) => {
  // State Variables & constants of module
  const { t } = useTranslation("signup");
  const [companyCreated, setcompanyCreated] = useState(false);
  const [hash, setHash] = useState('')
  const [link, setLink] = useState('')

  const { values, handleChange } = useInputForm();
  // const inputclasses =
  //   "require leading-normal flex-1 border-0  border-grey-light " &&
  //   "rounded rounded-l-none  outline-none pl-10 w-full focus:bg-blue-100 font-khula font-extrabold";
  const patronobligatorio = new RegExp("^(?!s*$).+");
  const { setcurrentCompanyData } = useContext(proponContext);

// Function to display error msg
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  // Wagmi useContractWrite hook setting & definition
  const { data, isError, isLoading, write } = useContractWrite({
    addressOrName: contractAddress,
    chainId: proponChainId,
    contractInterface: proponJSONContract.abi,    
    functionName: 'createCompany',
    onError(error) {
      let customError='unknownerror'
      console.log('error!!',error)
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
      // console.log('Hash seteado:',data.hash)
      // console.log('recordatodo:',`${data.hash.slice(0,10)}...${data.hash.slice(-11)}`)
      // console.log('link:',`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${data.hash}`)
      // setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${data.hash}`)
       setcompanyCreated(true)
      //setPhase(3)
    },
    })

    useContractEvent({
    addressOrName: contractAddress,
    contractInterface: proponJSONContract.abi,
    eventName: 'NewCompanyCreated',
    listener: (event) => console.log('evento escuchado:', event),
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
    const nextPhase = () => {
      saveContext()
      setPhase(3)
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

    // validation passed ok, let's save on DB (google sheet)
    // setSaving(true);
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
  const saveContext = (companyId, companyname) => {
    
    setcurrentCompanyData(values.companyname.trim(), values.companyId.trim())
  }

// render of Component
  return (
   <div className="w-[60%] mt-2">
    {/* Superior panel to explain & display call to actions */}
    <div className="p-4 bg-gray-100 border-2xl">
      <div className="text-xl font-khula text-stone-600 py-4">
        {isLoading ? 
            <p>{t('savingtoblockchainmsg')}</p>
            :
            (  companyCreated ? 
                    <div>
                      <p>{t('companyessentialdatasaved')} </p>
                      {/* <label>HASH:</label>
                      <Link href={link}>
                        <a> `${data.hash.slice(0,10)}...${data.hash.slice(-11)}`  </a>
                      </Link> */}
                      <div className="flex justify-center">
                        <button 
                        className="main-btn mt-8"
                        onClick={nextPhase}>
                          {t('closebutton')}
                        </button>
                      </div>
                    </div>
                    :
                    <p>{t('recordingcompanylegend')}</p>
            )
        }
      </div>
    </div>
    {/* Entry Form with buttons save & cancel */}
    <div id="dataentrypanel" className="mt-8  p-4 bg-gray-100 border-2xl">
      <p className="text-gray-600 text-extrabold text-xl mb-10 font-khula">
        {t("companyform.recordessentialdata")}
      </p>
      <form
        action=""
        className="flex flex-col items-center justify-between leading-8 mb-8"
      >
        <div className="w-[80%] relative mb-4">
          <InputCompanyId
            handleChange={handleChange}
            inputclasses={inputclasses}
            values={values}
            placeholder={`${t("companyform.companyId")}*`}
            disable={companyCreated}
          />
        </div>
        <div className=" w-[80%] relative mb-4">
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
        <div className=" py-4 flex flex-row justify-center border-t border-gray-300 rounded-b-md">
          <div className="mt-4 mr-10">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || companyCreated}
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
              onClick={()=>{alert('hey')}}
              disabled={isLoading|| companyCreated}
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
