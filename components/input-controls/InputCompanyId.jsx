import React from "react";
import { ReceiptTaxIcon } from '@heroicons/react/outline'

export function InputCompanyId({
  handleChange,
  inputclasses,
  values,
  placeholder,
  disable
}) {
  return (
    <>
      <ReceiptTaxIcon className="absolute h-4 w-4 sm:h-5 sm:w-5  text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.companyId || ''} 
        type="text" 
        id={'companyId'} 
        onChange={handleChange} 
        placeholder={placeholder}  
        disabled = {disable}
      />
    </>);
}
  