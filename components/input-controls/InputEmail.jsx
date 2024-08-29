import React from "react";
import { MailIcon } from '@heroicons/react/outline'

export function InputEmail({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
  <>
    <MailIcon className="absolute lg:h-4 lg:w-4 2xl:h-5 2xl:w-5  text-orange-400 mt-1 ml-2" />
    <input 
      className={inputclasses} 
      value={values.email || ''} 
      type="text" 
      id={'email'} 
      onChange={handleChange} 
      placeholder={placeholder}  
    />
  </>
  );
}
  