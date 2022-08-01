/* Utility function to process events handlers on each form in the App
*/

import { useState } from 'react';


const useInputForm = (initialValues={}) => {
  const [values, setValues] = useState(initialValues);
 console.log(values)
  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.id]: event.target.value }));
  }; 

  return {
    handleChange,
    values,
  }
};

export default useInputForm;