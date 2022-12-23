/**
 * uploadBlockchainFiles.js
 *      Process Files to upload to blockchain pro-pon contract
 *      1 Read file
 *      2 hash file content
 *      3 upload file to arweave
 *  The function returned a promise resolving with hash and arweave data id or
 *  reject with error
 *  As it proceed, it updates progress on setProgressPrctge
 *
 */

import { readFile } from "./filesOp";
import { uploadDataBundlr } from "../web3/uploadDataBundlr";
import { sha512 } from "crypto-hash";

export const uploadBlockchainFiles = (
  setuploadingSet,
  file,
  idx,
  ownerAddress,
  rfpId,
  remoteBundlr,
  fileType,
  rfpIndex
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await readFile(
        setuploadingSet,
        file,
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
        return resolve(loadingresult.txid);
      } else return reject(loadingresult); // pass up returning object from uploadDataBundlr (status, error.message)
    } catch (error) {
      console.log("Error en catch UploadBlockchian promesa ",idx,"el error es:",error);
      return reject(error);
    }
  });
};
