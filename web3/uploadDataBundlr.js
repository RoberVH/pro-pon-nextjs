import { WebBundlr } from "@bundlr-network/client"
import { utils } from "ethers";

/**  uploadDataBundlr
*    Upload File to Arweave through Bundlr
*    Define the tags to make uploaded file searchable with graphql
*    create a transaction and get it sign on the paying server using the remote Bundler Object
*    passed. With the signed signature upload content and tags from client to Bundlr
*/

 export const uploadDataBundlr = (remoteBundlr, address, file, fileData, filetype, rfpId, setProgressPrctge, idx) => {
  // export const uploadDataBundlr = (remoteBundlr, address,  filetype, rfpId, setProgressPrctge, idx) => {
  return new Promise(async (resolve, reject) => {
      
// tags array defines label with tag to our uploading content
// Helps to retrieve information at www.arweave.net/graphql
// Make the content discoverable on arweanet with this indexes
  const tags = [
    {name: "Content-Type", value: file.type},
    {name: "File", value: file.name },
    {name: "App-Name", value: "pro-pon"},
    {name: "App-version", value: "0.1.0" },
    {name: "owner", value: address },
    {name: "file-type", value:filetype},
    {name: "rfpId", value:rfpId}
  ]  
  const transaction = remoteBundlr.createTransaction(fileData, { tags })
   //advanced uploader
   const uploader = remoteBundlr.uploader.chunkedUploader;
   // divide loading into 10 chuncks - event should ring every chunksize bytes
   const chunksize=file.size/10 
   // in case chunksie is not within uploader limits set it to nearest limit
   if(chunksize < 500_000 ) chunksize = 500_000
   if(chunksize > 190_000_000) chunksize = 190_000_000
   uploader.setChunkSize(chunksize); 
   console.log('chunksize', chunksize)
   uploader.on("chunkUpload", (chunkInfo) => {
     console.log(`file: ${file.name} finished uploaded Chunk number ${chunkInfo.id}, 
       offset of ${chunkInfo.offset}, 
       size ${chunkInfo.size} Bytes, with a total of ${chunkInfo.totalUploaded} bytes uploaded.`);
       const prctje = (chunkInfo.totalUploaded/file.size)
       console.log('uploadDataBundlr de',file.name,'->', prctje)
       const progress=Math.round(50 * prctje)
       for (let i=0; i<1000; i++)
       setProgressPrctge( prevValue => prevValue.map( (value, indx) => (indx=== idx) ? (progress + value): value))
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
    const resp= await result.json()
    const signed = Buffer.from(resp.signeddata,"hex")
  //  add signed signature to transaction
    transaction.setSignature(signed)
    const res = await transaction.upload();
    console.log('res', res)
    // in case upload event never was call up, we set to 100%
    setProgressPrctge(prevValue => prevValue.map( (value, indx) => (indx=== idx) ? (100): value))
    resolve({status:true, txid:res.id})
    } catch (error) {
        console.log("Error", error);
        reject({status:false, msg:error})
    }
})
}

