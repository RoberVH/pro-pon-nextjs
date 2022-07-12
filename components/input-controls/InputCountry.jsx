import React from "react";
import { OfficeBuildingIcon } from '@heroicons/react/outline'

export function InputCountry({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
    <>
      <OfficeBuildingIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.coutry || ''} 
        type="text" id={'coutry'} 
        onChange={handleChange} 
        placeholder={placeholder}  
      />
    </>);
}
  