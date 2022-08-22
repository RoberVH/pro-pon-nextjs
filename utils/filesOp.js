/** filesOp.js
 * readFile .- Funcion que lee un archivo y retorna periodicamente el progreso de la lectura 
  *             Devuelve una promesa que se resuelve con la cadena con contenido del archivo 
  *             o con mensaje del error
  *             parametros: filetoRead - Descriptor del archivo a leer
  *             readType: el tipo de lectura que se realiza
 */
export const readFile = (filetoRead,  readType) => {

    return new Promise((resolve, reject) => {
        
        let reader = new FileReader();
        
        reader.onload = function(event) {
            //let contents = event.target.result;
            //console.log('onload resuelto')
            resolve({status: true,file:reader.result.split (",").pop(),message:''});
        };

        reader.onerror = function(event) {
            console.error("Archivo no se pudo leer " + event.target.error.code);
            reject({status: false,file: '',message: 'No se pudo obtener archivo'});
        };

        reader.onloadend = () => {
            // readAsURL retorna formato data:[<mediatype>][;base64],<data>, <data> tiene el contenido que interesa
            //console.log('onladend resuelto')
            resolve({status: true,file:reader.result.split (",").pop(),message:''});
        }

        reader.onprogress= (evt) => {
            let pctje=Math.round((evt.loaded / evt.total) * 100);
           // console.log('Leyendo: ',pctje)
            
        }

        switch (readType) {
            case 'readAsDataUrl':
                reader.readAsDataURL(filetoRead);
                break;
            case 'readAsText':
                reader.readAsText(filetoRead)
                break;
            default:
                reader.readAsDataURL(filetoRead);
         }
    })
}
export default readFile;