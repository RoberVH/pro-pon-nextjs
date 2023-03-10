import { useState, useEffect } from "react";
import { DownloadIcon } from "@heroicons/react/outline";
import { docTypes } from "../.././utils/constants";
import { getFileSecrets } from '../../database/dbOperations'
import { readFileArweave } from '../../utils/filesOp'
import Spinner from "../layouts/Spinner";
import { desCipherFile } from "../../utils/zipfiles";
import { toastStyle } from "../../styles/toastStyle";
import {  toast } from "react-toastify";
import { privateFileTypes } from '../../utils/constants'
import "react-toastify/dist/ReactToastify.css";

/**
@param {Object} props - The properties for the DownloadFileForm component.
@param {Array} rfpfiles - An array of RFP files that can be downloaded. this comprises all files
        associated to RFP, Request, response, Q&A etc files
@param {Function} t - The translation function for internationalization.
@param {string} docType - The record type of document showed to be downloaded.
@param {String} owner - Address of the user account logged in if.
@returns {JSX.Element} - The rendered DownloadFileForm component.
*/

const DownloadFileForm = ({
  rfpfiles,
  t,
  allowedDocTypes,
  owner,
  doneLookingFiles,
}) => {
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [timerWarning, setTimerWarning] = useState(false);

  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle
    });
  };

  /**
   * processDownload
   *    Verify conditions of file.
   *    if doctype is not private open the file link to arweave
   *    if is ecncrypted check if:
   *        now is greater than ending receiving date? yes -> Is this a technical proposal type? no then desencrypt and open it for user
   *        otherwise don't decrypt and notify user reasons why
   *                                                    
   *  
   * */
  const processDownload= async (file) => {
     // get the file from arweave
     const response = await fetch(`https://arweave.net/${file.idx}`);
     let dataContent = await response.arrayBuffer();
     let blob;
     if (privateFileTypes.includes(parseInt(file.docType.toString()))) {
          console.log('Es privado, hay que deencriptar')
          // get sercrets from DB
          const secrets= await getFileSecrets(file.idx) 	// checar secrets[0] object properties {idx:idx, psw:password, iv:newstr }
          if (!secrets.length) {
              console.log('No Secrets found:', secrets)
              errToasterBox('could not find file')
              return
              }
          if (typeof secrets.status!=='undefined')  {
              console.log('No Secrets found:', secrets)
              errToasterBox(secrets.msg)
              return
            }
          const IVuint8Array = new Uint8Array(secrets[0].iv.split(',').map(c => parseInt(c, 10)))
          const decryptedFile = await desCipherFile(dataContent,secrets[0].psw, file, IVuint8Array)
          blob= new Blob([decryptedFile], {type: 'application/octet-stream'}) // here the content Type
      } else { 
         blob = new Blob([dataContent], {type: 'application/octet-stream'}) // here the content Type
      }
      const url = URL.createObjectURL(blob);

      // create a new link element
      var link = document.createElement('a');
      // set its href attribute to the file URL
      link.href = url;
      // set its download attribute to the desired filename
      link.download = file.name;
      // programmatically click the link to trigger the download prompt
      link.click();
      document.body.appendChild(link);
       link.remove();

      // const a = document.createElement('a');
      // document.body.appendChild(a);
      // a.style = 'display: none';
      // a.href = url;
      // a.type= 'application/pdf'  // again the content Type
      // a.download = file.name
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
  }

  const ComponentLauncher = () => {
    if (!doneLookingFiles) return (
        <div className="border border-orange-400  font-khula font-bold text-stone-700 h-full
            w-full mb-8  shadow-lg">
          <div className="scale-50 ">
            <Spinner />
          </div>
        </div>
      );
    else return <DownloadComponent />;
  };

const DownloadComponent= () => {
  if (downloadableFiles.length) return (
    <div className=" max-h-[44rem] overflow-y-auto ">
      {timerWarning && (
        <p className="absolute p-2  left-[50%] text-center w-[15em] bg-orange-500 text-white">
          {t("Copied_clipboard")}
        </p>
      )}
      <table className="table-fixed border-collapse border border-orange-400  font-khula font-bold text-stone-700 h-full
             w-full mb-8  shadow-lg">
        <thead className="">
          <tr className="font-khula text-lg text-left text-stone-600 border border-orange-400">
            <th className=" px-4 py-2 w-1/3  ">
              <strong>{t("document_name")}</strong>
            </th>
            <th className="w-5/12 px-4 py-2   ">
              <strong>{t("document_hash")}</strong>
            </th>
            <th className="w-2/12 px-4 py-2   ">
              <strong>{t("doc_type")}</strong>
            </th>
          </tr>
        </thead>
        <tbody className="">
          {downloadableFiles.map((file) => (
            <tr key={file.idx} className="even:bg-stone-100 odd:bg-white">
              <td className="flex p-2 truncate">
                <div className="flex cursor-pointer" onClick={()=>processDownload(file)}>
                📥️ &nbsp;
                <p className="whitespace-pre text-sm"> {file.name}</p>

                  {/* <a
                    key={file.indx}
                    className="ml-2 flex"
                    href={`https://arweave.net/${file.idx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📥️ &nbsp;
                    <p className="whitespace-pre text-sm"> {file.name}</p>
                  </a> */}
                </div>
              </td>
              <td
                onClick={() => copyclipboard(file.documentHash)}
                className=" truncate   p-2 text-sm  cursor-pointer"
              >
                {file.documentHash}
              </td>
              <td className=" truncate   p-2 text-sm ">
                {t(docTypes[file.docType.toNumber()].desc)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
    else return (
    <div className="mt-2 flex items-center justify-center border shadow-lg h-40">
      <p className="whitespace-pre "> - {t("nofiles")} -</p>
    </div>
    )   
  }

  // copy the passed text ti clickboard and briefly turn on flag to show message copied to clipboard
  const copyclipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTimerWarning(true);
    setTimeout(() => setTimerWarning(false), 600);
  };

  useEffect(() => {
    if (rfpfiles)
      setDownloadableFiles(
        rfpfiles.filter(
          (doc) =>
            doc.owner.toLowerCase() === owner.toLowerCase() &&
            allowedDocTypes.some((obj) => obj.id === doc.docType.toString())
          //doc.docType.toNumber() === docType.id // is included on
        )
      );
  }, [rfpfiles, allowedDocTypes, owner]);

  return (
    <div className="m-auto py-2 max-w-[90%] ">
      <div id="downloadIcon" className="flex">
        <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
        <p className="mt-2 pl-2 font-khula">{t("dowloadrequestfiles")}</p>
      </div>
      <ComponentLauncher />
    </div>
  );
};
export default DownloadFileForm;
