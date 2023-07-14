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
import { privateFileTypes } from '../utils/constants'
import { cipherFile, desCipherFile } from "./zipfiles";

const password = require('secure-random-password');

export const uploadBlockchainFiles = (
  setuploadingSet,
  file,
  idx,
  ownerAddress,
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
          // here we will hash the data to register the file footprint to blockchain
          const hash = await sha512(result.file); 
          setuploadingSet((previousValue) =>
            previousValue.map((uploadObject, indx) =>
              indx === idx ? { ...uploadObject, hash: hash } : uploadObject
            )
          );
        } else reject(result); // pass up returning object from readFile (status, error.message)
      let dataContent = result.file;
      result=null // let's signal to garbage collector this is free to be clear right away
      // here we encrypt the file except if they are public files, i.e. if its fileType is included in private files
      // privateFileTypes is array of type number and fileType is type string 
      let passCode=''
      let iv
      let ivStr=''
      // check file doctype is private-type, if so, lets encrypting it
      if (privateFileTypes.includes(parseInt(fileType))) {
        // generate password and iv vector
        passCode = password.randomString({length:12})
        // get IV (uint8arry)
        iv = window.crypto.getRandomValues(new Uint8Array(12))
        // convert uInt8Arry  to string for later saving to DB or private contract
        ivStr=iv.toString()
        // encriptar archivo
        const resultEncryp = await cipherFile(dataContent, passCode, iv)
        if (!resultEncryp.status) reject(resultEncryp.msg) // pass up returning error from cipherFile
        dataContent=resultEncryp.file
      }

      // Save file whatever encrypted or not (RFP requesting docs) to Arweave
      // if filetype is one of the encryptable files ivStr and passCode carry the IV and password
      //they are empty otherwise
      const loadingresult = await uploadDataBundlr(
        setuploadingSet,
        remoteBundlr,
        ownerAddress,
        file,
        dataContent,
        fileType,
        idx,
        rfpIndex,
        ivStr,
        passCode
        );
      if (loadingresult.status) {
        // finally add the passed tile type to success uploadingSet array
        setResultObject(setuploadingSet, idx, 'docType', fileType)
        return resolve(loadingresult.txid);
      } else {
        return reject(loadingresult); // pass up returning object from uploadDataBundlr (status, error.message)
      }
    } catch (error) {
      return reject(error);
    }
  });
};
