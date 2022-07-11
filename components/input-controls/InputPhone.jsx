import React from "react";
import { PhoneIcon } from '@heroicons/react/outline'

export function InputPhone({
  handleChange,
  inputclasses,
  values
}) {
  return (
    <>
      <PhoneIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.phone || ''} 
        type="text" 
        id={'phone'} 
        onChange={handleChange} 
        placeholder="(000) 000-0000" 
      />
    </>);
}
  