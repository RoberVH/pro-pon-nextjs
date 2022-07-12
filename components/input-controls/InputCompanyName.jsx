import React from "react";
import { BadgeCheckIcon } from '@heroicons/react/outline'

export function InputCompanyName({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
    <>
      <BadgeCheckIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.companyname || ''} 
        type="text" id={'city'} 
        onChange={handleChange} 
        placeholder={placeholder}  
      />
    </>);
}
  