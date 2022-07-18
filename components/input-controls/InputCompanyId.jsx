import React from "react";
import { ReceiptTaxIcon } from '@heroicons/react/outline'

export function InputCompanyId({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
    <>
      <ReceiptTaxIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.companyid || ''} 
        type="text" id={'companyid'} 
        onChange={handleChange} 
        placeholder={placeholder}  
      />
    </>);
}
  