import React from "react";
import { GlobeAltIcon } from '@heroicons/react/outline'

export function InputRFPwebsite({
  handleChange,
  inputclasses,
  values,
  placeholder,
  disable
}) {
  return (
  <>
    <GlobeAltIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2"/>
    <input 
    className={inputclasses} 
    value={values.rfpwebsite || ''}
    type="text" id={'rfpwebsite'} 
    onChange={handleChange} 
    disabled={disable}
    placeholder={placeholder}  />
  </>
  )
}
  