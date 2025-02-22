import React from "react";
import { ChartSquareBarIcon } from '@heroicons/react/outline'

export function InputRFPName({
  handleChange,
  inputclasses,
  values,
  placeholder,
  disable
}) {
  return (
  <>
    <ChartSquareBarIcon className="absolute h-4 w-4 sm:h-5 sm:w-5 text-orange-400 mt-1 ml-2"/>
    <input 
    className={inputclasses} 
    value={values.name || ''}
    type="text" id={'name'} 
    onChange={handleChange} 
    disabled={disable}
    placeholder={placeholder}/>
  </>
  )
}
  