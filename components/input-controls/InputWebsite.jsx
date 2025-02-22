import React from "react";
import { GlobeAltIcon } from '@heroicons/react/outline'

export function InputWebsite({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
    <>
      <GlobeAltIcon className="absolute h-4 w-4 sm:h-5 sm:w-5   text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.website || ''} 
        type="text" 
        id={'website'} 
        onChange={handleChange} 
        placeholder={placeholder}  
      />
    </>);
}
  