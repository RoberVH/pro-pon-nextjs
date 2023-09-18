/** filesOp.js
 * readFile .- Read a file and periodically returns reading progress
  *             Returns a Promise that resolvesto content file data 
  *             or error message
  *             parameters: filetoRead - File descriptor
  *             readType: Reading Type
 */
 
import { setResultObject } from '../utils/setResultObject'
const MaxProgress = 40  // set how much percentage of this reading process is reflected on progress bar at UX

export const readFile = (setuploadingSet, filetoRead,  readType, idx) => {
   return new Promise((resolve, reject) => {

    let reader = new FileReader();
    reader.onload = function(event) { // finished reading file successfully
         return resolve({status:true, file: reader.result})
    };
    reader.onerror = function(event) {
        setResultObject(setuploadingSet, idx, 'error', reader.error)
        // setuploadingSet(previousValue => previousValue.map( (uploadObject, indx) => 
        //                (indx=== idx) ? {...uploadObject,error:reader.error} : uploadObject))        
         reject(reader.error)
    };
    reader.onprogress= (evt) => {
        let pctje=Math.round((evt.loaded / evt.total) * MaxProgress);
        setResultObject(setuploadingSet, idx, 'progress', pctje)
        // codigo para probar rechazos
        if (false ) {  //pctje > 25 && (idx===-22 )) {
                setResultObject(setuploadingSet, idx, 'error', 'Error simulado en lectura de segundo archivo' )
                setResultObject(setuploadingSet, idx, 'status', 'error')
                return reject({error: 'falso error en READ FILE', idx:idx}) //for testing
            }
        // setuploadingSet(previousValue => previousValue.map( (uploadObject, indx) => 
        //                      (indx=== idx) ? {...uploadObject,progress:pctje} : uploadObject))
    }
    switch (readType) {
        case 'readAsDataUrl':
            reader.readAsDataURL(filetoRead)
            break
        case 'readAsText':
            reader.readAsText(filetoRead)
            break
        case 'readAsArrayBuffer':                
            reader.readAsArrayBuffer(filetoRead)
            break
        default:
            reader.readAsDataURL(filetoRead)
        }
     })
}
export default readFile;

