import React from 'react'
import { useEffect } from 'react'
import useInputForm from '../hooks/useInputForm'
import { useTranslation } from "next-i18next";

function SearchDB({ fields, path,  setResults, setWait, setError, t}) {
  const {  values, handleChange} = useInputForm();
  
  
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
          { field.searchable &&
            <input 
              className="font-khula border-b-2 border-orange-200 text-stone-900 outline-none 
              p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8"
              type='text' 
              id= {field.fieldName}
              placeholder={t(field.fieldName)}
              value={values[field.fieldName]}
              onChange={handleChange}
            />
          }
        <div>
        </div>
        </div>
        )}
    </div>
  )
}

export default SearchDB