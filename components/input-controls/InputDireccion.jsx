import React from "react";
import { HomeIcon } from '@heroicons/react/outline'

export function InputDireccion({
  handleChange,
  inputclasses,
  values
}) {
  return (
  <>
    <HomeIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2"/>
    <input 
      className={inputclasses} 
      value={values.dirfis1 || ''}
      type="text" 
      id={'dirfis1'} 
      onChange={handleChange} 
      placeholder="Dirección*"  />
  </>
  )
}
  