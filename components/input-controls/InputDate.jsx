import React from "react";
import {CalendarIcon} from '@heroicons/react/outline'

export function InputDate({
  handleChange,
  inputclasses,
  dateId,
  values,
  placeholder,
  disable
}) {
  return (
  <>
    <CalendarIcon className="absolute h-4 w-4 sm:h-5 sm:w-5  text-orange-400 mt-1 ml-2 "/>
    <input 
    className={inputclasses} 
    //value={values['dateId'] || ''}
    type="text"
    id={dateId} 
    disabled = {disable}
    onChange={handleChange} 
    placeholder={placeholder}  
    onFocus={(e) => e.currentTarget.type = "datetime-local"}
    onBlur={(e) => {e.currentTarget.type = "text"; e.currentTarget.placeholder=placeholder}}
    />
  </>
  )
}
  