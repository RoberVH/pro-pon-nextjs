import React from "react";
import { OfficeBuildingIcon } from '@heroicons/react/outline'

export function InputCity({
  handleChange,
  inputclasses,
  values
}) {
  return (
    <>
      <OfficeBuildingIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.city || ''} 
        type="text" id={'city'} 
        onChange={handleChange} 
        placeholder="Ciudad*" 
      />
    </>);
}
  