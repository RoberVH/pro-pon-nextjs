/**
 * setResultObject
 *      A function to make cleaner  mutation of  state var array properties
 *      settingFunction - useState Hook setting funtion
 *      idx - position in array of object to mutate
 *      key - property name being mutated
 *      value - value for the property new value the mutation produces on array
 */

export const setResultObject = (settingFunction, idx, key, value) => {
settingFunction(previousValue => previousValue.map( (uploadObject, indx) => 
(indx=== idx) ? {...uploadObject,[key]:value} : uploadObject))
}