/* Utility function to process events handlers on each form in the App
*/

import { useState } from 'react';


const useInputForm = () => {

  const [values, setValues] = useState({});

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