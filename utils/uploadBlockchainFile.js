/**
 * uploadBlockchainFile.js
 *      Process Files to upload to blockchain pro-pon contract
 *      1 Read file
 *      2 hash file content
 *      3 upload file to arweave
 *  The function returned a promise resolving with hash and arweave data id or
 *  reject with error
 *  As it proceed, it updates progress on setProgressPrctge
 *  
 */

import { readFile } from './filesOp'
import { uploadDataBundlr } from '../web3/uploadDataBundlr'
import { sha512 } from 'crypto-hash'


export const uploadBlockchainFile =  (file, idx,setProgressPrctge, ownerAddress, rfpId, setHashSet, remoteBundlr, fileType ) => {
return new Promise(async (resolve, reject) => {
    try {
        const result= await readFile(file, 'readAsArrayBuffer', setProgressPrctge, idx)
        if (result.status) {
             // here we will hash the data to register the file footprint to blockchain
             const hash = await sha512(result.file);
             setHashSet( prevValue => prevValue.map( (value, indx) => (indx=== idx) ? hash : value))
             //resolve(result.file)
             } else reject(result) // pass up returning object from readFile (status, error.message)
        // all right,  continue uploading file to Bundlr server-paid
         const loadingresult = await uploadDataBundlr(remoteBundlr, ownerAddress, file, result.file, fileType, rfpId, setProgressPrctge, idx)
        if (loadingresult.status) resolve({status:true})
        else reject (loadingresult) // pass up returning object from readFile (status, error.message)
    } catch (error) {
        reject( error.message )
    }
})
}