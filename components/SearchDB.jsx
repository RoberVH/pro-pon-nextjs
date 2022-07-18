import React from 'react'
import { useEffect } from 'react'
import useInputForm from '../hooks/useInputForm'

function SearchDB({ fields, path,  t, setResults}) {
  const {  values, handleChange} = useInputForm();
  
  const getResults = async (values) => {
    for (const key in values) {
      if ((values[key]).trim() === '') delete values[key];
  }
   console.log('values:', values)
    if (Object.keys(values).length === 0) return
    const params=new URLSearchParams(values)
    const url=path + params
    try {
          const response = await fetch(url);
          const data = await response.json();
          setResults(data)
          return;
    } catch (error) {
        console.log("Error del server:", error);
      // errToasterBox(data.msg, toastStyle);
    } finally {
        console.log('final de getresults')
    }
  }
  

  useEffect(()=>{
      getResults(values)
  },[values])
  

  return (
    <div className="p-2 flex justify-evenly ">
    { 
        fields.map((field) => 
        <div key={field.id} className="resize">
          { field.searchable &&
            <input 
              className="font-khula border-b-2 border-orange-200 text-stone-900 outline-none 
              p-2  rounded-md focus:bg-stone-100 focus:rounded-md"
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