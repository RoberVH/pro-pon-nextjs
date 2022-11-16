/** filesOp.js
 * readFile .- Read a file and periodically returns reading progress
  *             Returns a Promise that resolvesto content file data 
  *             or error message
  *             parameters: filetoRead - File descriptor
  *             readType: Reading Type
 */
export const readFile = (filetoRead,  readType, setProgressPrctge, idx) => {
   return new Promise((resolve, reject) => {

    let reader = new FileReader();
    reader.onload = function(event) { // finished reading file successfully
         resolve({status:true, file: reader.result})            
        //return ({status:true, file: reader.result})            
    };
    reader.onerror = function(event) {
         reject({status: false,file: '',message: reader.error})
    };
    reader.onprogress= (evt) => {
        let pctje=Math.round((evt.loaded / evt.total) * 50);
        setProgressPrctge( prevValue => prevValue.map( (value, indx) => (indx=== idx) ? pctje: value))
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