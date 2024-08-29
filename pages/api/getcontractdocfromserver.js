/**
 * /api/getcontractdocfromserver
 *   Get the Document metadata belonging to RFP given on param rfpIndex from the Contract
 *  NOTE 1: JavaScript handles objects and arrays. In JavaScript, when an array has additional properties, those properties are 
 *  not included when the array is serialized to JSON. This is why the properties like cancelDate, canceled, issuer, etc. are 
 *  lost when sending the array from the server to the client. When the Polygon EVM returns the RFP from contract, it includes
 *  all the props in an array: [val1, val2, ...], 
 *  the WWeb3 library flesh out the propoerty names and add them to the same object array, producing a weird array of arrays with values like [value1, valu2, propVal1:value1, propVal2: value2].
 *  But those named props got lost when sent to the client because of what was explained. And yet those props are needed in the receiving client
*   When we do const RFPObject = {...RFP};  and pass it back to the client, we are constructing a plain object (not the original 
    array), that gets fully serialized
    In case of error make sure to always return an object {status:false, msg: <Id error string>}
*/
import { sortWeb3Error } from '../../utils/sortWeb3Error'
import {  getProponContractServer } from '../../web3/servercontractsettings'


export default async function handler(req, res) {
    const { method } = req
    try {
     switch (method) {
      case 'GET':
            // get the bundler instance from the key we use at the server
           try {
           const result= await getProponContractServer()
           if (!result.status) {
            throw new Error(result.error)
            }
            const proponContract=result.contract
           let rfpidx = req.query.rfpidx;
           const Documents = await proponContract.getDocumentsfromRFP(rfpidx)
           // Next line  is to fix the problem of sending an object having an array and named properites back through http
           // see NOTE 1 in the header
           const DocObjects = Documents.map(([docType, name, owner, documentHash, idx]) => {
               return {docType,name,owner,documentHash,idx}
             })
           res.status(200).send( {status:true, documents:DocObjects} );
           break    
        } catch (error) {
            res.status(200).send( {status:false, error:error} )
            return
         }
       default:
           res.status(503).json({status:false, msg:'bad_method'})
           break
     }
    } catch (error) {
        errorMessage=sortWeb3Error(error)
        res.status(503).json({ status: false, msg: errorMessage });
    }

}