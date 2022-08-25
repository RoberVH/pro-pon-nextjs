import { useEffect, useState } from 'react'
import useInputForm from '../hooks/useInputForm'
import CountryParamSearch  from '../components/CountryParamSearch'
import { useTranslation } from "next-i18next";

//t, handleChange, values, i18n, setPlaceHolder, companyData, profileCompleted
const errorColor = {
  true:'border-red-400 border-4',
  false:''
}
function SearchDB({ fields, path,  setResults, setWait, setError, t, i18n}) {
  const {  values, handleChange} = useInputForm();
  
  const SearchBox = ({field}) => {
    const [faultyDates,setFaultyDates] = useState(false)
  
    useEffect(()=>{
      setFaultyDates ((values[`${field.fieldName}_end`] <= values[`${field.fieldName}_ini`] ))
    },[field.fieldName]) 

  const InputSearchTerm = () => {
    return (
        <input className="font-khula border-b-2 border-orange-200 text-stone-900 outline-none 
                  p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8"
          type='text' 
          id= {field.fieldName}
          placeholder={t(field.fieldName)}
          value={values[field.fieldName]}
          onChange={handleChange}/>)
      }

  return (
    <div className="">
      {
        !field.date 
        ? // no date type
          ( // check if country tpye
            field.fieldName!=='country'?
               <InputSearchTerm /> :
                <CountryParamSearch 
                t={t}
                i18n={i18n}
                handleChange={handleChange}
                values={values}
                />
          )
        :
          (
          <div className="flex  mt-3 ml-4">
            <label className="text-stone-400 mr-2" >{t(field.fieldName)}:</label>
            <div className={`-mt-6 flex flex-col border border-3 rounded-md w-32
             ${errorColor[faultyDates]} `} >
              <input 
                className="font-khula  text-stone-900 outline-none border
                py-1 pl-2  rounded-md focus:bg-stone-100 focus:rounded-md "
                type='text' 
                id= {`${field.fieldName}_ini`}
                placeholder={t('initialdate')}
                value={values[`${field.fieldName}_ini`]}
                onChange={handleChange}
                onFocus={(e) => e.currentTarget.type = "date"}
                onBlur={(e) => {e.currentTarget.type = "text"; e.currentTarget.placeholder=t('initialdate')}}/>

                <input 
                className="font-khula  text-stone-900 outline-none 
                py-1 pl-2  rounded-md focus:bg-stone-100 focus:rounded-md"
                type='text' 
                id= {`${field.fieldName}_end`}
                placeholder={t('finaldate')}
                value={values[`${field.fieldName}_end`]}
                onChange={handleChange}
                onFocus={(e) => e.currentTarget.type = "date"}
                onBlur={(e) => {e.currentTarget.type = "text"; e.currentTarget.placeholder=t('finaldate')}}/>
            </div>
          </div>
          )}
    </div>
  )};
  
 

  const getResults = async (values) => {
    for (const key in values) {
      if ((values[key]).trim() === '') delete values[key];
    }
    if (Object.keys(values).length === 0) return
    const params=new URLSearchParams(values)
    const url=path + params
    try {
          setWait(true)
          const response = await fetch(url);
          const data = await response.json();
          setResults(data)
          return;
    } catch (error) {
        console.log("Error del server:", error.message);
      setError(error)
    } finally {
      setWait(false)
    }
  }
  

  useEffect(()=>{
      getResults(values)
  },[values])
  

  return (
    <div className="p-2 flex justify-start ">
    { 
      fields.map((field) => 
        <div key={field.id} className="resize">
          {field.searchable && <SearchBox field={field} /> }
        </div>
        )
      }
    </div>
  )
}


    function undefined({t, handleChange}) {
      return (<input className="font-khula border-b-2 border-orange-200 text-stone-900 outline-none 
              p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8 b" type='text' id={field.fieldName} placeholder={t(field.fieldName)} value={values[field.fieldName]} onChange={handleChange} />);
    }
  export default SearchDB