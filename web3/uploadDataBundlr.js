import { WebBundlr } from "@bundlr-network/client"
import { utils } from "ethers";
import { setResultObject } from '../utils/setResultObject'
import { saveFileSecrets } from '../database/dbOperations'

/**  uploadDataBundlr
*    Upload File to Arweave through Bundlr
*    Define the tags to make uploaded file searchable with graphql
*    create a transaction and get it sign on the paying server using the remote Bundler Object
*    passed. With the signed signature upload content and tags from client to Bundlr
*/
 export const uploadDataBundlr = (setuploadingSet, remoteBundlr, address, file, fileData, filetype, idx, rfpIndex,ivStr,
  password) => {
  return new Promise(async (resolve, reject) => {

    const MaxBundlrArweaveProgress = 80   // max percentage to show max when uploading the file to arweave on UX progress Bar
// tags array defines label with tag to our uploading content
// Helps to retrieve information at www.arweave.net/graphql
// Make the content discoverable on arweanet with this indexes
  const tags = [
    {name: "Content-Type", value: file.type},
    {name: "File", value: file.name },
    {name: "App-Name", value: "pro-pon"},
    {name: "App-version", value: "0.1.0" },
    {name: "owner", value: address },
    {name: "doc-type", value:filetype}, // the docType of file, the filetype is a number, 
                                        //the index property  on docTypes records Object in utils/constant.js file
    {name: "rfpIndex", value:rfpIndex.toString()},
  ]  
  // console.log('FILE:', file)
  // console.log('typeof FILE:', typeof file)
  console.log('FILE:', fileData)
  console.log('typeof FILE:', typeof fileData)
  const transaction = remoteBundlr.createTransaction(fileData, { tags })
  //const transaction = remoteBundlr.createTransaction(fileData, { tags: [{ tags }] })
  
   //advanced uploader
   const uploader = remoteBundlr.uploader.chunkedUploader;
   // divide loading into 10 chuncks - event should ring every chunksize bytes
   const chunksize=file.size/10 
   // in case chunksie is not within uploader limits set it to nearest limit
   if(chunksize < 500_000 ) chunksize = 500_000
   if(chunksize > 190_000_000) chunksize = 190_000_000
   uploader.setChunkSize(chunksize); 
   uploader.on("chunkUpload", (chunkInfo) => {
       const prctje = (chunkInfo.totalUploaded/file.size)
       const progress=Math.round(50 * prctje)
       setuploadingSet(previousValue => previousValue.map( (uploadObject, indx) => 
                      (indx=== idx) ? {...uploadObject,progress:progress} : uploadObject))
   });   
  // get signature data
  const signatureData = Buffer.from(await transaction.getSignatureData());
  // get signature signed by server
  try {
    const result = await fetch("/api/serversigning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datatosign: Buffer.from(signatureData).toString("hex") }),
    });
       // codigo para probar rechazos
        if (false) { // idx===-11) {
                setResultObject(setuploadingSet, idx, 'error', 'Error simulado en uploading Bundlr' )
                setResultObject(setuploadingSet, idx, 'status', 'error')
                return reject( 'Rejecting.. falso error uploading Bundlr')
            }
    const resp= await result.json()
    const signed = Buffer.from(resp.signeddata,"hex")
  //  add signed signature to transaction
    transaction.setSignature(signed)
    const res = await transaction.upload();
    // in case upload event never was call up because file was too small, we set progress to 100%
    setResultObject(setuploadingSet, idx, 'progress', MaxBundlrArweaveProgress)
    // signal we have finish here
    setResultObject(setuploadingSet, idx, 'status', 'success')
    setResultObject(setuploadingSet, idx, 'name', file.name)
    // and saved unto object the Bundlr/Arweave Id of file
    setResultObject(setuploadingSet, idx, 'fileId', res.id)
    // save secrets to BD where index of record is the same as the bundle id 
    // we have to do this here because we need the res.id from Arweave as unique secrets record identifier
    console.log('por salvar a BD', res.id, password, ivStr)
    const dbresult= await saveFileSecrets({idx:res.id, psw:password, iv:ivStr, docType: filetype })
   // if (!dbresult.resp.status) reject({status:false, msg:dbresult.error}) // pass up returning error from cipherFile 
    return resolve({status:true, txid:res.id})
    } catch (error) {
      setResultObject(setuploadingSet, idx, 'status', 'error')
      setResultObject(setuploadingSet, idx, 'error',  error.message )
      reject({status:false, msg:error.message})
    }
})
}


