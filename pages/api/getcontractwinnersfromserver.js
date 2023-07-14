/**
 * /api/getcontractwinnersfromserver
 *   Get the RFP given on param rfpIndex from the Contract
 *  NOTE 1: JavaScript handles objects and arrays. In JavaScript, when an array has additional properties, those properties are 
 *  not included when the array is serialized to JSON. This is why the properties like cancelDate, canceled, issuer, etc. are 
 *  lost when sending the array from the server to the client. When the Polygon EVM returns the RFP from contract, it includes all the props
 *  in an array, the WWeb3 library flesh out the propoerty names and add them to the same object array. But they got lost
*/
import { utils } from "ethers";
import {  getProponContractServer } from '../../web3/servercontractsettings'
import { parseWeb3Error }  from '../../utils/parseWeb3Error'
import { proponContext } from "../../utils/pro-poncontext";



export default async function handler(req, res) {
    const { method } = req
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
         const winners = await proponContract.getWinners(rfpidx)
         res.status(200).send( {status:true, winners:winners} )
         break    
        } catch (error) {
            res.status(200).send( {status:false, error:error} )
            return
         }
     default:
        res.status(404).send( {status:false, message:'bad_method'} )
        break
        }

}