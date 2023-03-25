import React from "react";
import { BadgeCheckIcon } from '@heroicons/react/outline'

export function InputCompanyName({
  handleChange,
  inputclasses,
  values,
  placeholder,
  disable
}) {
  return (
    <>
      <BadgeCheckIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.companyname || ''} 
        type="text" 
        id={'companyname'} 
        onChange={handleChange} 
        placeholder={placeholder}  
        disabled = {disable}
      />
    </>);
}
  