import React from "react";
import {UserIcon} from '@heroicons/react/outline'

export function InputNombre({
  handleChange,
  inputclasses,
  values
}) {
  return (
  <>
    <UserIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2"/>
    <input 
    className={inputclasses} 
    value={values.nombre || ''}
    type="text" id={'nombre'} 
    onChange={handleChange} 
    placeholder="Nombre de quien recibe*"  />
  </>
  )
}
  