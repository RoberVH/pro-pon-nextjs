import React from "react";
import { LocationMarkerIcon } from '@heroicons/react/outline'

export function InputZIP({
  handleChange,
  inputclasses,
  values
}) {
  return (
    <>  
      <LocationMarkerIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2" />
      <input 
        className={inputclasses} 
        value={values.zip || ''} 
        type="number" 
        id={'zip'} 
        onChange={handleChange} 
        placeholder="Código Postal*" 
        />
    </>
  );
}
  