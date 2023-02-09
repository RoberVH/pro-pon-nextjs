import { useEffect, useState, useRef,  forwardRef, useImperativeHandle } from 'react'
import useInputForm from '../hooks/useInputForm'
import InputCountrySel  from './InputCountrySel'
import { SearchIcon } from "@heroicons/react/outline";

const errorColor = {
  true:'border-red-400 border-4',
  false:''
}
const  SearchDB= forwardRef(({ fields, path,  setResults, setWait, setError, t, i18n}, ref) => {
  
  const {  values, handleChange, handleReinitialize} = useInputForm();
  const [currInput, setCurrInput] = useState()
  
  const inputRefs = useRef([]);
  const uSEReference = useRef // to avoid calling a hook inside a callback when setting inputRefs next line
  inputRefs.current=fields.map(() => uSEReference(null))
  
  const prehandleChange= (e,ref) => {
    handleChange(e)
    setCurrInput(ref)
  }
  
  const SearchBox = ({field, index}) => {
    const [faultyDates,setFaultyDates] = useState(false)
  
  useEffect(()=>{
    setFaultyDates ((values[`${field.fieldName}_end`] <= values[`${field.fieldName}_ini`] ))
  },[field.fieldName]) 
  

  const InputSearchTerm = () => {
    return (
        <input className="font-khula border-b-2 border-orange-200 text-stone-900 outline-none 
                  p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8"
          //ref={ref} // add the ref to the input field
          ref={inputRefs.current[index]}
          type='text' 
          id= {field.fieldName}
          placeholder={t(field.fieldName)}
          value={values[field.fieldName]}
          //onChange={(e) => prehandleChange(e,ref)}
          onChange={(e) => prehandleChange(e,inputRefs.current[index])}
          />)
      }

  return (
    <div className="">
      {
        !field.date ? // no date type
          ( // check if country tpye
            field.fieldName!=='country'?  
                  <InputSearchTerm /> 
                 :
                  <InputCountrySel 
                    t={t}
                    i18n={i18n}
                    handleChange={prehandleChange}//{handleChange}
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
                onChange={prehandleChange}//{handleChange}
                onFocus={(e) => e.currentTarget.type = "date"}
                onBlur={(e) => {e.currentTarget.type = "text"; e.currentTarget.placeholder=t('finaldate')}}/>
            </div>
          </div>
          )}
    </div>
  )};
  
 

  const  getResults = async (values) =>  {
    for (const key in values) {
      if ((values[key]).trim() === '') delete values[key];
    }
    if (Object.keys(values).length === 0) return
    // filter out country param if its value is 'default'
    if (values.country === "default") delete values.country;
    const params=new URLSearchParams(values)
    const url=path + params
    try {
          setWait(true)
          const response = await fetch(url);
          const data = await response.json();
          setResults(data)
          return;
    } catch (error) {
        console.log("Server error:", error.message);
      setError(error)
    } finally {
      setWait(false)
      if (currInput) currInput.current.focus()
    }
  }
  

  useEffect(()=>{
    getResults(values)
  },[values])
  
  useImperativeHandle(ref, ()=> ({
    resetparams() {
      handleReinitialize()
      setResults([])
    }
  }))

  const handleCleanFields=()=>{
    handleReinitialize()
    setResults([])
  }

  return (
    <div  className="p-2 flex justify-start ">
      <div onClick={handleCleanFields} className="-ml-6  pr-2 cursor-pointer group relative inline-block">
        <SearchIcon className="ml-8 h-8 w-8 text-orange-400  " />
        <span className="tooltip-span-rigth mt-2 mr-4">
                                {t('reset_search')}
                                </span>
      </div>
    { 
      fields.map((field,index) => 
        <div key={field.id} className="resize">
          {field.searchable && <SearchBox field={field} index={index}/> }
        </div>
        )
      }
    </div>
  )
})


SearchDB.displayName = 'SearchDB';

export default SearchDB
