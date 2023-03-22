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

export const cipherFile = async (file, password, iv) => {
    const enc = new TextEncoder();
    const digest = await window.crypto.subtle.digest("SHA-256", enc.encode(password))
    const rawFile=file
      const key = await getKey(digest)
    try {
    let cipherText = await encryptFile(key, iv, rawFile )
    return {status: true, file:cipherText}
    //const fileBlob= new Blob([cipherText],{type: file.type})
     } catch (error) {
      return {status:false, msg:error}
  }
  
};

export const desCipherFile = async (rawfile, password, iv) => {
  const enc = new TextEncoder();
  const digest = await window.crypto.subtle.digest("SHA-256", enc.encode(password))
  const key = await getKey(digest)
  const desCipherText = await decryptFile(key, iv, rawfile)
  return desCipherText
};

//  convert  string to Uint8Array
export const cvrtStrtoUint8 = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}


// const downloadFile = (fileBlob,name) => {
//   const url = URL.createObjectURL(fileBlob);
//   const a = document.createElement('a');
//   document.body.appendChild(a);
//   a.style = 'display: none';
//   a.href = url;
//   a.download = name
//   a.click();
//   window.URL.revokeObjectURL(url);
//   document.body.removeChild(a);
// }