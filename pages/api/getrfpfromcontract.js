/**
 * /api/getrfpfromcontract
 *   Get the RFP given on param rfpIndex from the Contract
 *  NOTE 1: JavaScript handles objects and arrays. In JavaScript, when an array has additional properties, those properties are 
 *  not included when the array is serialized to JSON. This is why the properties like cancelDate, canceled, issuer, etc. are 
 *  lost when sending the array from the server to the client. When the Polygon EVM returns the RFP from contract, it includes all the props
 *  in an array, the WWeb3 library flesh out the propoerty names and add them to the same object array. But they got lost
 * when sent to the client because of what was explained.
 * When we do const RFPObject = {...RFP};  and pass it back to the client, we are constructing a plain object that gets fully serialized
*/
import {  getProponContractServer } from '../../web3/servercontractsettings'


export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            try {
            // get the bundler instance from the key we use at the server
            const result= await getProponContractServer()
            if (!result.status) {
                res.status(403).send( {status:false, message:result.message})
                return
             }
            const proponContract=result.contract
            let rfpidx = req.query.rfpidx;
            const RFP = await proponContract.getRFPbyIndex(rfpidx)
            // Next line  is to fix the problem of sending an object having an array and named properites back through http
            // see NOTE 1 in the comments header
            const RFPObject = {...RFP}; 
            res.status(200).send( {status:true, rfp:RFPObject} );
            break    
        } catch (error) {
            res.status(403).send( {status:false, message:error.message} )
            return
         }
        default:
            res.status(404).send( {status:false, message:'bad_method'} )
        break
        }

}