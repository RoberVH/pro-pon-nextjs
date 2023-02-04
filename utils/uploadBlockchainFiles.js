/**
 * uploadBlockchainFiles.js
 *      Process Files to upload to blockchain pro-pon contract
 *      1 Read file
 *      2 hash file content
 *      3 upload file to arweave
 *  The function receive:
 *    setuploadingSet  a fuction to set an arry (uploadingSet) that will hold processed files, it adds properties to 
 *    corresponging object in the arrray: file name, hash, fileId on Arweave, status (the starting uploadingSet array has all status
 *    to pending)
 *   Object contiaing the name size, dates and original browser File object to recover the content of files to be processed,
 *   Corresponding position in uploadingSet for this file entry
 *   ownerAddress  - Blockchain address account of owner of file
 *   rfpId  - Id of RFP
 *   rfpIndex - Pro-pon contract global  Id of RFP in RFPs structure
 *    
 * returned a promise resolving with hash and arweave data id or
 *  reject with error
 *  As it proceed, it updates progress on setProgressPrctge
 *
 */

import { readFile } from "./filesOp";
import { uploadDataBundlr } from "../web3/uploadDataBundlr";
import { sha512 } from "crypto-hash";
import { setResultObject } from "./setResultObject";

export const uploadBlockchainFiles = (
  setuploadingSet,
  file,
  idx,
  ownerAddress,
  rfpId,
  remoteBundlr,
  fileType,   // Doctype - is a numberic index property of docType record in Object docTypes in file constants.js
  rfpIndex
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await readFile(
        setuploadingSet,
        file.originalFile,
        "readAsArrayBuffer",
        idx
      );
      if (result.status) {
        /* !!! here, if type of file is passwordable, must be created a password and 
        check is still legible after unencrypting it. probalbly check the hash*/
          // here we will hash the data to register the file footprint to blockchain
          const hash = await sha512(result.file);
          setuploadingSet((previousValue) =>
            previousValue.map((uploadObject, indx) =>
              indx === idx ? { ...uploadObject, hash: hash } : uploadObject
            )
          );
        } else reject(result); // pass up returning object from readFile (status, error.message)
      // all right,  continue uploading file to Bundlr server-paid
      const loadingresult = await uploadDataBundlr(
        setuploadingSet,
        remoteBundlr,
        ownerAddress,
        file,
        result.file,
        fileType,
        rfpId,
        idx,
        rfpIndex
        );
      if (loadingresult.status) {
        // finally add the passed tile type to success uploadingSet array
        setResultObject(setuploadingSet, idx, 'docType', fileType)
        return resolve(loadingresult.txid);
      } else return reject(loadingresult); // pass up returning object from uploadDataBundlr (status, error.message)
    } catch (error) {
      console.log("Error on catch UploadBlockchian promise ",idx,"error is:",error);
      return reject(error);
    }
  });
};
