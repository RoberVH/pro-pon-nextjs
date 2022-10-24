/* Utility function to process events handlers on each form in the App
*/

import { useState } from 'react';


const useInputForm = (initialValues={}) => {
  const [values, setValues] = useState(initialValues);
  console.log('useInputForm - initialValues',initialValues)
  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.id]: event.target.value }));
    // if (values.open) console.log('open', JSON.stringify(values.open)) // Object.prototype.toString.call(values.open))
    // if (values.invitation) console.log('invitation', values.invitation.toString()) //Object.prototype.toString.call(values.invitation))
  }; 

  return {
    handleChange,
    values,
  }
};

export default useInputForm;