/**
 * MyRFPs
 *      Page to display RFPs belonging to current company, 
 *      It should read them from Contract, not DB
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useState, useEffect, useCallback, useContext, Fragment } from "react";
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const { BigNumber } = require("ethers");

import DisplayItems from "../components/rfp/displayItems";
import GralMsg from "../components/layouts/gralMsg";
import NoItemsTitle from "../components/layouts/NoItemsTitle";
import { proponContext } from "../utils/pro-poncontext";

import Spinner from "../components/layouts/Spinner";
import { getContractRFP } from '../web3/getContractRFP'
import { toastStyle, toastStyleSuccess } from "../styles/toastStyle";
import { toast } from "react-toastify";

import { docTypes, openContest, inviteContest } from "../utils/constants";


import { createZipArchive, zippasswFile, encryptFile, readData, cipherFile, desCipherFile,
  cvrtUInt8AtoStr, cvrtStrtoUint8 } from '../utils/zipfiles'


import { getFileSecrets, saveFileSecrets } from "../database/dbOperations";



function MyRFPs() {
  const [loading, setloading] = useState(true)
  const [noRFP, setNoRFP] = useState(false)

  const [file, setFile] = useState()
  const [descLink, setDescLink] = useState()
  const [iv, setIV] = useState()

  const { companyData, address } = useContext(proponContext);
  const router = useRouter()
  const { t } = useTranslation("rfps");
  const t_companies = useTranslation("companies").t; // tp search for companies when inviting them
  const { i18n } = useTranslation("companies");
 

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  // code to encrypt/decrypt files
  // for each encryption is necesary to keep password and iv generated to be able to deencrypt later the file
  
  //const password='Bonita has p!eda&z#s tu ES?p.jo'
//  Inner Components ******************************************************************




// Example usage:
function compareUint8Arrays(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

const handleFileChange= async (e) => {
  // console.log('e.target.files',e.target.files)
  // console.log('e.target.files.length',e.target.files.length)
  // console.log('e.target.files[0]',e.target.files[0])
  const file=e.target.files[0]
  setFile(file)
  cipherFile(file, password, setIV)
  //createZipArchive(file, password)

}
const testIV = async () => {
  for (let i=0; i<50; i++) {
    //console.log('Pasword:',  password.randomPassword({ characters: [password.lower, password.upper, password.digits, password.symbols] }))
    console.log('Pasword:',password.randomString({length:12}))

  }
  return
  let iv, striv, tempiv, recoverstr, newstr;
  // let myc='¯¾fi\x8B\x8E\x1D\x92Wÿ\x13_'
  // for (let i = 0; i < myc.length; i++) {
  //   console.log('i=',i,'char=',myc[i]);
  // }

  const arr = new Uint8Array(255);
  for (let i = 0; i < 255; i++) {
    arr[i] = i;
  }
  // console.log('arr', arr)
  // console.log('arr to string', arr.toString())
  // return
  /*
  lo mas idoneo es convertir el iv a strin con iv.toString()
  esto forma un array de strings y reconvertir  con 
    const bytes = newstr.split(',').map(c => parseInt(c, 10));
     const uint8Array = new Uint8Array(bytes);
     probar salvando a la BD
  */
 // for (let i=0; i<1000_000; i++) {
      //iv = window.crypto.getRandomValues(new Uint8Array(12))
      iv = arr
      //striv=cvrtUInt8AtoStr(iv)
      //striv= String.fromCharCode(...new Uint8Array(uint8Array));
      const ivStr=iv.toString()
      //const password='$5z_039x.#da 23'
      //  const bytes = newstr.split(',').map(c => parseInt(c, 10));
      //  const uint8Array = new Uint8Array(bytes);
      const uint8Array = new Uint8Array(ivStr.split(',').map(c => parseInt(c, 10)))
      if (!compareUint8Arrays(iv,uint8Array)) console.log('failed', iv, uint8Array)
      // if ((i % 200_000)===0) console.log('iv.',iv, uint8Array)
  //}
  console.log('iv.',iv, uint8Array)
  console.log('done')
  return

     const idx=`0344b91a6c92d0bb002`
     const result= await saveFileSecrets({idx:idx, psw:password, iv:newstr })
     console.log('SaveFileSecrets respuesta:', result)
     if (!result.status) {
        console.log(result.msg)
        return
      }
     const secrets= await getFileSecrets(idx)
     console.log('BD secrets returned', secrets)
     if (!secrets) {      
      console.log('no results from DB secrets')
      return
    }
    const ivDB = secrets[0].iv
    console.log('ivDB', ivDB)
    const ivCnverted = ivDB.split(',').map(c => parseInt(c, 10))
    const uint8ArrayBD = new Uint8Array(ivCnverted);
    console.log('iv', iv)
    console.log('uint8ArrayBD',uint8ArrayBD)
    if (!compareUint8Arrays(iv,uint8ArrayBD)) console.log('failed!')

    
    // {idx:req.body.idx, psw:req.body.psw, iv:req.body.iv }

    //  const newiv= uint8Array.toString()
    //  console.log('newiv ', newiv)
    //  console.log('newstr',newstr)
    // console.log('iv        ', iv)
    // console.log('uint8array', uint8Array)
    // if (!compareUint8Arrays(iv,uint8Array)) console.log('failed', iv, uint8Array)
     //for (let j=0; j<newstr.length; j++) console.log(newstr[j])
    //  console.log('striv',striv)
    //  console.log( 'newstr',newstr)
    //  tempiv= cvrtStrtoUint8(striv)
    //  recoverstr=cvrtUInt8AtoStr(tempiv)
    //  if (striv !== recoverstr) {
    //     console.log('fail')
    //     console.log(iv,striv,tempiv,recoverstr) 
    //   }
    //if (newstr!==striv) console.log('!', striv, newstr)
   // if ( (i % 10_000_000) ===0 ) {console.log('check',iv,uint8Array); //console.log('bytes',bytes)
//  }
//  }
console.log('finished')

}

const handleDescipherCHange = async (e) => {
  const file=e.target.files[0]
  setFile(file)
  desCipherFile(file,password, file, iv)
}

 return (
    <div className="m-24">
      <div className="w-24 h-24">
        <label className="p-2 text-orange-500 bg-yellow-100">Encrypt:</label>
        <input
          className="mt-2 mb-4 border-2 border-orange-400 font-khula mx-auto  text-sm  text-orange-500 file:mr-4 
          file:py-2 file:px-4file:rounded-full file:border-0 file:text-sm file:font-semibold w-150 
          file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          onChange={ handleFileChange}
          type="file"
          // multiple
          />
        <label className=" p-2 text-orange-500 bg-yellow-100">DesEncrypt:</label>
        <input
          className=" mt-2 border-2 border-orange-400 font-khula mx-auto  text-sm  text-orange-500 file:mr-4 
          file:py-2 file:px-4file:rounded-full file:border-0 file:text-sm file:font-semibold w-150 
          file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          onChange={ handleDescipherCHange}
          type="file"
          // multiple
          />          
      </div>
        <button className="mt-24 border-2 border-orange-500" onClick={testIV}>Prueba</button>
    </div>
  );

}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "rfps",
        "common",
        "gralerrors",
        "menus",
        "companies",
      ])),
    },
  };
}

export default MyRFPs;