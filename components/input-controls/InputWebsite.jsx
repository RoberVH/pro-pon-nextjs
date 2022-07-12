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
      <GlobeAltIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.website || ''} 
        type="text" id={'city'} 
        onChange={handleChange} 
        placeholder={placeholder}  
      />
    </>);
}
  