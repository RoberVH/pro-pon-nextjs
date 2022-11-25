/**
 * setResultObject
 *      A function to make cleaner when mutating state array objects useState hook properties
 *      settingFunction - useState Hook setting funtion
 *      idx - position in array of object to mutate
 *      key - property name
 *      value - value for the property 
 */

export const setResultObject = (settingFunction, idx, key, value) => {
settingFunction(previousValue => previousValue.map( (uploadObject, indx) => 
(indx=== idx) ? {...uploadObject,[key]:value} : uploadObject))
}