import React from "react";
import {UserIcon} from '@heroicons/react/outline'

export function InputAdminName({
  handleChange,
  inputclasses,
  values,
  placeholder
}) {
  return (
  <>
    <UserIcon className="absolute lg:h-4 lg:w-4 2xl:h-5 2xl:w-5 text-orange-400 mt-1 ml-2"/>
    <input 
    className={inputclasses} 
    value={values.adminname || ''}
    type="text" 
    id={'adminname'} 
    onChange={handleChange} 
    placeholder={placeholder}  />
  </>
  )
}
  