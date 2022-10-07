import React from "react";
import { NewspaperIcon } from '@heroicons/react/outline'

export function InputRFPDescription({
  handleChange,
  inputclasses,
  values,
  placeholder,
  disable
}) {
  return (
  <>
    <NewspaperIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2"/>
    <input 
    className={inputclasses} 
    value={values.description || ''}
    type="text" id={'description'} 
    onChange={handleChange} 
    disabled={disable}
    placeholder={placeholder}  />
  </>
  )
}
  