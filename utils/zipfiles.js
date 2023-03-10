// //import CryptoJS from 'crypto-js';
// import crypto from 'crypto-js';
// import { WordArray } from 'crypto-js';

// This function takes an array of file objects, and returns a Promise that
// resolves to a Blob representing the zip archive of the files.
// export async function createZipArchive(file,password) {
//   console.log('type of file', file.type)
//     // const zip = new JSZip();
//     //   const fileContents = await file.arrayBuffer();
//     // // Generate the zip archive
//     // //const zipBlob = await zip.generateAsync({ type: 'blob' });
//     // const zipBlob = await  zip.generateAsync({
//     //   type: 'uint8array',
//     //   compression: 'DEFLATE',
//     //   compressionOptions: {
//     //     level: 9,
//     //   },password: password,
//     // })
//     // const blob = new Blob([zipBlob], { type: 'application/octet-stream' });
//     // downloadFile(blob,file.name)
//     const zip = new JSZip();
//     const fileContents = await file.arrayBuffer();
//     // Convert the file contents to a Uint8Array
//     const contentsArray = new Uint8Array(fileContents);
//     // Add the file to the zip archive
//     zip.file(file.name, contentsArray);
//     // Generate the zip archive
//     const zipBlob = await zip.generateAsync({
//       type: 'uint8array',
//       compression: 'DEFLATE',
//       compressionOptions: {
//         level: 9,
//       }
//     });
//     const blob = new Blob([zipBlob], { type: 'application/octet-stream' });
//     downloadFile(blob, file.name);    
// };



//   export async function zippasswFile(file, password) {
//     console.log('zippassFile called!')
//     const key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef');
// const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');

//     const MAX_FILE_SIZE = 100000000; // 100 MB
//     console.log('password', password)
//     if (file.size > MAX_FILE_SIZE) {
//       return 'File size is too large';
//     }
//     const reader = new FileReader();
//     reader.onload = function() {
//       const fileContent = reader.result;
//       const zip = new JSZip();
//       zip.file(file.name, fileContent);
//       zip.generateAsync({
//         type: 'uint8array',
//         compression: 'DEFLATE',
//         compressionOptions: {
//           level: 9,
//         },
//         password: password,
//       }).then(async function(content) {
//         const fileContents =  content
//         const byteArray = [...new Uint8Array(fileContents)];
//         const encryptedData = CryptoJS.AES.encrypt(byteArray, password, key, { iv: iv });
//         //const blob = new Blob([content], { type: 'application/zip' });
//         const blob = new Blob([encryptedData], { type: 'application/zip' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         document.body.appendChild(a);
//         a.style = 'display: none';
//         a.href = url;
//         a.download = file.name + '.zip';
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   }


  // export async function readData(file) {
  //   const reader = new FileReader();
  //   reader.onload = function(event) { // finished reading file successfully
  //     console.log('finnish reading: ',reader.result)
  //     return resolve( reader.result)
  //   }
  //   reader.readAsArrayBuffer(file)
  // }

  /***************************************************************************************************************************** */

  // var FileSaver = require("file-saver");



// export function formatBytes(bytes) {
//   var marker = 1024; // Change to 1000 if required
//   var decimal = 3; // Change as required
//   var kiloBytes = marker; // One Kilobyte is 1024 bytes
//   var megaBytes = marker * marker; // One MB is 1024 KB
//   var gigaBytes = marker * marker * marker; // One GB is 1024 MB
//   var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

//   // return bytes if less than a KB
//   if (bytes < kiloBytes) return bytes + " Bytes";
//   // return KB if less than a MB
//   else if (bytes < megaBytes)
//     return (bytes / kiloBytes).toFixed(decimal) + " KB";
//   // return MB if less than a GB
//   else if (bytes < gigaBytes)
//     return (bytes / megaBytes).toFixed(decimal) + " MB";
//   // return GB if less than a TB
//   else return (bytes / gigaBytes).toFixed(decimal) + " GB";
// }


function getKey(value) {
  return window.crypto.subtle.importKey("raw", value, "AES-GCM", true, [
    "encrypt",
    "decrypt"
  ]);
}

export const encryptFile = async (key, iv, file) => {
  return await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    file
  );
};

// get the iv which is similar the salt value used for encryption
// export const getiv = () => {
//   return window.crypto.getRandomValues(new Uint8Array(12));
// };

// // load the file in the memory
// export const getFile = async (inputFile) => {
//   return await inputFile.arrayBuffer();
// };

export const decryptFile = (key, iv, cipherText) => {
  return window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    cipherText
  );
};

// export const getDigest = (uid) => {
//   let enc = new TextEncoder();
//   return window.crypto.subtle.digest("SHA-256", enc.encode(uid));
// };

export const cipherFile = async (file, password, iv) => {
  console.log('cipherfile recibe:', file, password,iv)
    const enc = new TextEncoder();
    const digest = await window.crypto.subtle.digest("SHA-256", enc.encode(password))
    const rawFile=file
    //const rawFile = await file.arrayBuffer()
    //const iv = window.crypto.getRandomValues(new Uint8Array(12))
//    console.log('iv as uInt8Array:', iv)
    //const iv1 = cvrtUInt8AtoStr(iv)
  //  const iv1 = iv.toString()
   // console.log('iv as string', iv1)
   // console.log('typeof iv as string', typeof iv1)
   // console.log('length iv as string', iv1.length)
    //setIv(iv1)
    //const ivagain=cvrtStrtoUint8(iv1)
    //const ivagain = new Uint8Array(iv1.split(',').map(c => parseInt(c, 10)))
    //console.log('iv back again from str', ivagain)
    const key = await getKey(digest)
    //console.log('crypto key:', key)
    try {
    let cipherText = await encryptFile(key, iv, rawFile )
    return {status: true, file:cipherText}
    //const fileBlob= new Blob([cipherText],{type: file.type})
   } catch (error) {
      return {status:false, msg:error}
  }
    cipherFile = null
    downloadFile(fileBlob, file.name.split('.')[0] + '.ENC')
};

export const desCipherFile = async (rawfile, password, file, iv) => {
   console.log('Por desencriptar:')
  // const iv = new Uint8Array(iv1.split(',').map(c => parseInt(c, 10)))
   console.log('Recibido:', password, iv, file, rawfile)

  
  const enc = new TextEncoder();
  const digest = await window.crypto.subtle.digest("SHA-256", enc.encode(password))
  //const rawFile = await cipherfile.arrayBuffer()
  //const rawFile = await rawfile.arrayBuffer()
  const rawFile = await rawfile
  
  const key = await getKey(digest)
  const desCipherText = await decryptFile(key, iv, rawFile)
  console.log('Descrifrado:', desCipherText)
  return desCipherText
};


// convert Uint8Array to string
// export const cvrtUInt8AtoStr= (uint8Array) => {
//   return String.fromCharCode(...new Uint8Array(uint8Array));
//   // return String.fromCharCode.apply(null, new Uint8Array(buf));
// }

//  convert  string to Uint8Array
export const cvrtStrtoUint8 = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}


// // convert Uint8Array to string
// const cvrtUInt8AtoStr= (uint8Array) => {
//   // Check if TextEncoder and TextDecoder are available
//     const isTextEncoderAvailable = typeof TextEncoder !== 'undefined';
//     const isTextDecoderAvailable = typeof TextDecoder !== 'undefined';
//     console.log(`TextEncoder available: ${isTextEncoderAvailable}`);
//     console.log(`TextDecoder available: ${isTextDecoderAvailable}`);
//     //return uint8Array.toString()
//       const decoder = new TextDecoder('utf-8');
//   return decoder.decode(uint8Array);
// }

// // // convert  string to Uint8Array
// const cvrtStrtoUint8 = (string) => {
//     //return Uint8Array.from(string)
//     const encoder = new TextEncoder('utf-8');
//     return encoder.encode(string);
//   }


const downloadFile = (fileBlob,name) => {
  const url = URL.createObjectURL(fileBlob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}