import { useState, useContext } from 'react'
import { useTranslation } from "next-i18next";
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";

import { toastStyle } from '../../styles/toastStyle'
import { toast } from 'react-toastify';
import  useInputForm  from '../../hooks/useInputForm'
import 'react-toastify/dist/ReactToastify.css';

import { InputCity } from '../input-controls/InputCity';
import { InputPhone } from '../input-controls/InputPhone';
import { InputWebsite } from '../input-controls/InputWebsite';
import { InputCompanyId } from '../input-controls/InputCompanyId';
import { InputCompanyName } from '../input-controls/InputCompanyName';
import { InputZIP } from '../input-controls/InputZIP';
import { InputDireccion } from '../input-controls/InputDireccion';
import { InputEmail } from '../input-controls/InputEmail';
import { InputNombre } from '../input-controls/InputNombre';
import { InputState } from '../input-controls/InputState';

import  MEX_STATES from '../../utils/mexicostates.json'
import { useEffect } from 'react';
//import axios from 'axios'

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);

const CompanyDataForm = ({ userNftsArray }) => {
  const { t, i18n } = useTranslation("signup");
  const [saving, setSaving] = useState(false)
  const [countryList, setCountryList] = useState([]);
  const { values, handleChange } = useInputForm();
  
  // const { address } = useContext(lbtContext)

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  }


  useEffect(()=>{
    function changeLanguage() {
      const lang=i18n.language
      const countryGen=countries.getNames(lang)
      const countryArray=Object.values(countryGen)
      switch (lang) {
        case 'fr':
          countryArray.sort((a,b)=> a.localeCompare(b,'fr'))
          break
        case 'es':
          countryArray.sort((a,b)=> a.localeCompare(b,'fr'))
          break
          case 'en':
          default:
            countryArray.sort((a,b)=> a.localeCompare(b,'en'))
            break
      }
      setCountryList(countryArray)
    }
    changeLanguage()
  },[i18n.language])

  
  const handleSave = async () => {
    const trimmedValues={};
    for (let [key, value] of Object.entries(values)) {
      trimmedValues[key]= (typeof value !== 'undefined' ? value : '').trim()
    }
    if (!validate(patronobligatorio,  trimmedValues.nombre,'Nombre obligatorio')) return
    if (!validate(patronemail, trimmedValues.email, 'formato email incorrecto')) return
    if (!validate(patronobligatorio, trimmedValues.dirfis1, 'Dirección obligatoria')) return
    if (!validate(patroncp, trimmedValues.zip, 'Código postal obligatorio a 5 digitos')) return
    if (!validate(patronobligatorio, trimmedValues.city, 'Ciudad obligatoria')) return
    if (typeof trimmedValues.state==='undefined' || trimmedValues.state.includes('Seleccione')) {
        errToasterBox('Estado obligatorio')
        return
      }
    // validation passed ok, let's save on DB (google sheet)
    setSaving(true)
    try {
      console.log('Saving data')
      // const resp = await axios.post(
      //   "/api/saveuserdata", 
      //   {
      //     userdata:trimmedValues,
      //     serials:userNftsArray, 
      //     address
      //   }, 
      //   {
      //     headers: {"Content-Type": "application/json"}
        // }
      // )  
      setSaving(false)
    // }
    // toast.success('Datos guardados correctamente', toastStyle);
    //   return 
    } catch (error) {
        errToasterBox('No se pudieron guardar los datos',toastStyle)
      }    
    }

    const inputclasses ="leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " && 
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100"

    const patronemail= new RegExp("^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const patronobligatorio= new RegExp("^(?!\s*$).+")
    const patroncp = new RegExp("^[0-9]{5}$")
    
    const validate = (pattern, value, msj) => {
        const trimValue= (typeof value !== 'undefined' ? value : '').trim() 
        if (!pattern.test(trimValue)) {
          errToasterBox(msj)
          return false
        } else { return true}
      }    

    return (
    <div id= "dataentrypanel" className="w-[89%]   relative p-4 bg-gray-100 border-2xl">        
        <p className="text-gray-600 mb-8">
          {t('companyform.recordcompanytitle')}
        </p>
        <form action="" className="mt-4 flex flex-col mx-4 leading-8 mb-8">
          <div  className="flex flex-row justify-between">
            <div className="w-[50%] relative">
              <InputNombre  
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values}
                placeholder={`${t("companyform.adminname")}*`}
              />
            </div>
            <div className="w-[45%] relative">
                <InputCompanyName
                  handleChange={handleChange} 
                  inputclasses={inputclasses}  
                  values={values}
                  placeholder={`${t("companyform.companyname")}*`}
                />
            </div>              
          </div>
          <div className="mt-8 flex flex-row justify-between">
          <div className="w-[45%] relative">
              <InputCompanyId   
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values} 
                placeholder={`${t("companyform.companyId")}*`}
              />
          </div>            
          <div className="w-[45%] relative">
              <InputEmail   
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values} 
                placeholder={`${t("companyform.emailcompany")}*`}
              />
          </div>
          </div>
          <div  className="mt-8 flex flex-row justify-between">
            <div className="w-[65%] relative">
                  <InputDireccion   
                    handleChange={handleChange} 
                    inputclasses={inputclasses}  
                    values={values}
                    placeholder={`${t("companyform.addresscompany")}*`}
                  />
            </div>    
            <div className="w-[30%] relative ml-6">
                <InputPhone   
                  handleChange={handleChange} 
                  inputclasses={inputclasses}  
                  values={values}
                  placeholder={`${t("companyform.telephone")}`}
                />
            </div>              
          </div>   
          <div  className="mt-4 flex flex-row justify-between">
          </div>       
          <div  className="mt-8 flex flex-row justify-between">
            <div className="w-[30%] relative ">
              <InputWebsite   
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values}
                placeholder={`${t("companyform.website")}`}
              />
            </div>     
            <div className="w-[30%] relative ">
              <InputZIP   
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values}
                placeholder={`${t("companyform.zip")}*`}
              />
            </div>
            <div className="w-[30%] relative">
              <InputCity   
                handleChange={handleChange} 
                inputclasses={inputclasses}  
                values={values}
                placeholder={`${t("companyform.city")}*`}
              />
            </div>                  
          </div>       
          <div  className="mt-8 flex flex-row justify-start ">
            <div className="w-[25%] relative">
                  <InputState
                    handleChange={handleChange} 
                    inputclasses={inputclasses}  
                    values={values}
                    placeholder={`${t("companyform.state")}*`}
                  />
            </div> 
            <div className="w-[35%] relative ml-16">
                <select 
                  className="form-select block w-full px-3 py-1.5 text-base font-roboto bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300 outline-none rounded transition ease-in-out
                    m-0 border-0 border-grey-light rounded rounded-l-none focus:bg-blue-100 
                    text-gray-500" 
                  onChange={handleChange}
                  id={'state'}
                  defaultValue={"default"}
                >
                  <option value={"default"} disabled >{`${t("companyform.country")}*`}</option>
                      {countryList.map((country, index) => (
                        <option 
                          key={index}
                          value={country}
                        >
                        {country}
                      </option>
                      ))}
                </select>                    
            </div> 
 
          </div>
        </form>
        <div id="footersubpanel3">
          <div className="p-4  border-t border-gray-300 rounded-b-md mx-8">
                <div  className="flex flex-row justify-center mt-4">
                  <button type="button" onClick={handleSave}
                    className="bg-orange-400 font-xl font-bold font-khula  mr-10 px-6 py-2.5  
                    text-white leading-tight uppercase rounded shadow-md hover:bg-orange-700 hover:shadow-lg 
                    focus:bg-orange-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-orange-800 
                    active:shadow-lg transition duration-150 ease-in-out
                    ${saving===5 ? 'cursor-not-allowed' : ''}`"
                  >
                    {!saving ? 'save':''}
                    {saving &&
                    <div className=" flex justify-evenly items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900">
                      </div>
                      <p className="pl-4"> ...&nbsp;Salvando</p>
                    </div>
              }
                  </button>                      
                </div>
          </div>
            </div>        
        </div>        
        // </div>
)
}
export default CompanyDataForm