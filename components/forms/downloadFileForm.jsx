/**
  DownloadFileForm
      Displays a table of files names & hashes associated to an RFP for user to download them
      When click on the name or type fields the row is selected and gets into the list of files to download
      If click on the hash filed the hash get copied to the list
*/
import { useState, useContext, useEffect, useRef, Fragment } from "react";
import { proponContext } from "../../utils/pro-poncontext";
import { useTranslation } from "next-i18next";
//import Image from "next/image"
import { DownloadIcon } from "@heroicons/react/outline";
import { docTypes, IdxDocTypes, privateFileTypes, traslatedRFPErrors } from "../.././utils/constants";
import { useSignMessage } from "../../hooks/useSignMessage";
import { getFileSecrets } from "../../database/dbOperations";
import { SignMsgAlert } from "./../layouts/SignMsgAlert";
import Spinner from "../layouts/Spinner";
import { desCipherFile } from "../../utils/zipfiles";
import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import { convUnixEpoch } from "../../utils/misc";
import { parseWeb3Error } from '../../utils/parseWeb3Error'
import "react-toastify/dist/ReactToastify.css";

const DownloadFileForm = ({
  rfpfiles,
  dateEnd,
  allowedDocTypes,
  owner,
  doneLookingFiles,
  rfpIndex,
}) => {
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [timerWarning, setTimerWarning] = useState(false);
  const [showSignMsg, setShowSignMsg] = useState(false);
  const [selectAll, setSelectAll] = useState(false); // state to keep track of checkbox state
  const [processedFiles, setProcessedFiles] = useState([]);
  
  
  // There are some asynchronous functionss that reject to the main download loop at handleAllDownloadSelectedFiles
  // because they are activated after displaying message windows and called in other sections of code we need to memorize what
  // is the reject/resolve promise so it's catched at the right point, That's why we use an useRef to store the functions
  // notice that a useState var won't work

  const rejectDownloadLoop = useRef(null) 
  const resolveDownloadLoop = useRef(null) 
  const params = useRef(null)         // paramters to call decryipting file process between different functions
  const downloadFolder = useRef(null) // destination folder to download files

  const { t } = useTranslation(["rfps", "signup", "common","gralerrors"]);
  const { companyData } = useContext(proponContext);

  //   hooks ***************************************************************************
  // whe rfpFiles gets instantiated because files' metadata was read on rfpDocuments' DownloadFileForm component it
  // triggers setting of a filtered version of them on downloadableFiles that in turn causes displaying them on table
  useEffect(() => {
    if (rfpfiles)
      setDownloadableFiles(
        rfpfiles.filter(
          (doc) =>
            doc.owner.toLowerCase() === owner.toLowerCase() &&
            allowedDocTypes.some((obj) => obj.id === doc.docType.toString())
        )
      );
  }, [rfpfiles, allowedDocTypes, owner]);

  
  const signMessage = useSignMessage({ onSuccess, onError });

  // hook callbacks **********************************************************************************

  // onSuccess When calling sing of hook useSignMessage it will call this callback to continue process for getting document
  async function onSuccess(message, signature) {
    // add message and signature needed properties to params for later use at processDownload
    params.current.message = message;
    params.current.signature = signature;
    processDownload();
  }

  // onError- if error when hook useSignMessage signing process here
  // the rejection has to be catch at main loop so use the store promise reject function on the Ref var rejectDownloadLoop
  async function onError(error) {
    const customError = parseWeb3Error(t, error);
    rejectDownloadLoop.current({msg:customError})
  }

  
  //************************************* utility functions ********************************************************/

  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
  };
  
  // toggle property selected on all downloadableFiles array. Notice that this property is not original in the array but 
  // if needed is asigned here
   const toggleAllEntries = () => {
     setDownloadableFiles(prevFiles => prevFiles.map(prevFile => {return { ...prevFile, selected: !selectAll }}
      ));
      setSelectAll(!selectAll);
  };

  // toggle property selected on selected downloadableFiles array. Notice that this property is not original in the array but 
  // if needed is asigned here
  const toggleSelectedFile = (file) => {
    setDownloadableFiles(prevFiles => prevFiles.map(prevFile => {
      if (prevFile.idx === file.idx) {
        return { ...prevFile, selected: !prevFile.selected };
      }
      return prevFile;
    }));
  };

  // when user clics on button downloadAllSelectedFiles it sorts out selected files and set them in processedFiles Array
  // to download them and execute the process to download them
 const handleDownloadAllSelectedFiles = async () => {
  const selectedFiles = downloadableFiles.filter(file => file.selected)  
  setProcessedFiles(selectedFiles.map(file => ({...file, status: ''})));
  if (!selectedFiles.length) {
    errToasterBox(t('nofiles_selected'))
    return
  }  
  // check if there are private files and the time hasn't been reached yet
  // privateFileTypes comes from   IdxDocTypes definition so is an array of numbers whereas file.docType is a bignumber
  const privateFiles =  selectedFiles.filter(file => privateFileTypes.includes(parseInt(file.docType.toString())))  
  // first check if date time to download has arrive. this is a courtesy first check, when requesting documents anyway
  // dates and privacy will be check again at server in case of posted links outside propon App
  if (privateFiles.length > 0 && convUnixEpoch(new Date()) <= dateEnd) {
    errToasterBox(t("notimetodownload"))
    // clean state
    setDownloadableFiles(prevFiles => prevFiles.map(file => ({ ...file, selected: false })));
    setProcessedFiles([])
    setSelectAll(false)
    return;
  }    
    // Main loop to download all selected files on processedFiles
    // selectedFiles var use because with var state processedFiles we will miss iterations
  for (const file of selectedFiles) {
    try {    
        // processedFiles state var used for UI to display what's going on
        setProcessedFiles(prevFiles => 
            prevFiles.map(elem => elem.idx === file.idx ? { ...elem, status: 'processing' } : elem))
        await downloadFile(file) 
        // resolved with success, change the status to true at same entry
        setProcessedFiles(prevFiles => 
          prevFiles.map(elem => elem.idx === file.idx ? { ...elem, status: 'success' } : elem))  
    } catch (error) {
    
      setProcessedFiles(prevFiles => 
         prevFiles.map(elem => {
              if (elem.idx=== file.idx) return ({...elem, status:'failure', msg: t(error.msg)})
                else return elem
              }
          )
      )
    }
  }
  // we finish, set all selected attributes of files in download table (downloadableFiles) to false
  setDownloadableFiles(prevFiles => prevFiles.map(file => ({ ...file, selected: false })));
  setSelectAll(false) // and in also clean select all flag
};

  /**saveBlobAsFile
   *    Save the received blob as a file
   *    NOTE:  Disable  option to choose folder as most browsers on windows won't allow it
  */
  const saveBlobAsFile = async (option, filePath, writableBlob, filename) => {
    let blob;
    if (option==='filePath') {  // is a public file that needs to be download from Arweave
      try {
        const url = filePath
        const response = await fetch(url)
        if (!response.ok) {
          const resp= response.statusText
          throw new Error(resp)
        }
        blob = await response.blob();
        
      } catch (error) {
        // arweave gives error (Not Found), we'll keep this generic error message 'couldnt_readfile'
        rejectDownloadLoop.current({msg:'couldnt_readfile'})
        return
      }
    } else blob = writableBlob // is a private already downloaded & decrypted file
    // whatever it got the blob, from now on is the same code to write it
      try {
            downloadBlob(filename, blob)
            resolveDownloadLoop.current() // resolve current document download promise
      } catch (error){
               rejectDownloadLoop.current({msg:'error_writing_file'}) // reject THIS document download promise
        }
      };
      
      
  

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Sets the download attribute with the desired filename
    a.style.display = "none";
    document.body.appendChild(a);
    a.click(); // Triggers the download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  /************************************* end of temporary*************************************************************** */

  /*********************************************************************************************** */
  /**processDownload
   *    This function is called when there is a encrypted (confidential/Private) file,
   *    Confidential file is a file only RFP issuer can download after end of receiving date reached
   *    Confidential file must provide message and signature for the server to validate, if the requester
   *    is entitled to it (is RFP issuer) at present time a file is confidential if is Proposal type
   *    Private file is a  private file only before end of receiving date is reached,  when it becomes public
   *    Anyway, server will check if end of receiving date is reached to deliver both confidential and private file secrets
   */
  const processDownload = async () => {
   // even if there is no message/signature (because is private only) try to get them to short size of code
    const {
      globalIndex,
      arweaveFileIdx,
      message = undefined,
      signature = undefined,
    } = params.current;
    let msg = message;
    if (typeof msg !== "undefined") msg = JSON.parse(message); // destringify message
    const requestingFileprops = { globalIndex, arweaveFileIdx, msg, signature }
    try {
        const resp = await getFileSecrets(requestingFileprops)
        if (!resp.status) throw new Error(resp.msg)
        // get the arweave encrypted file
        const response = await fetch(`https://arweave.net/${params.current.arweaveFileIdx}`)
        const arrayBuffer = await response.arrayBuffer();
        const dataContent = new Uint8Array(arrayBuffer);
        const IVuint8Array = new Uint8Array(
          resp.secrets.iv.split(",").map((c) => parseInt(c, 10))
        );
        const decryptedFile = await desCipherFile(
          dataContent,
          resp.secrets.psw,
          IVuint8Array
        );
        const blob = new Blob([decryptedFile], {
          type: "application/octet-stream",
        }); 
        // Let's call function in charge to download the blob, and manage the resolve if all ok
        saveBlobAsFile("blob", null, blob, params.current.filename);
    } catch (error) {
      let msgErr = error.message;
      if (traslatedRFPErrors.includes(error.message)) {
        msgErr = t(error.message) // take the translation of error label from rfp.json langauge file!
      } else if (error.message.includes('err_bd'))
              msgErr = t(error.message,{ns:"gralerrors"})
      rejectDownloadLoop.current({msg:msgErr})
    }
  };

  //************************************handlers  ***********************************************************************/

/**
 * downloadFile
 *    Verify conditions of file.
 *    if doctype is not private open the file link to arweave
 *    if is ecncrypted check if:
 *        now is greater than ending receiving date? yes -> Is this a technical proposal type? no then desencrypt and open it for user
 *        otherwise don't decrypt and notify user reasons why
 *
 *
 * */
  async function downloadFile  (file) {
    return new Promise ((resolve, reject) => { 
      // store references to both resolve/reject to be albe to for use them in asynchronous code later
      rejectDownloadLoop.current = reject
      resolveDownloadLoop.current = resolve
      //eventually add a spinner but beware it won't interfere with displayed signing message
      // get the doctype category of the file: could be a private up to end receiving date is reached or be always public 
      try {
         const isPrivateFile = privateFileTypes.includes(parseInt(file.docType.toString()))
        // if file is of private then is encrypted and we first decrypt it, else, go to  download it  straighforward
        if (isPrivateFile) {
            // we'll use this param object on our asyncronus flow for decrypting and signing a message for a confidential file
            params.current = {
              docType: file.docType.toString(),
              globalIndex: rfpIndex,
              arweaveFileIdx: file.idx,
              filename: file.name,
            };
            // check if document is confidential (proposal type presently; only available if end of receiving date reached 
            // AND is requested by RFP issuer)
            if (parseInt(file.docType.toString()) === IdxDocTypes.documentProposalType) {
              // Is a CONFIDENTIAL  file only to be revealed to issuer of RFP after endofreceiving data has been reached
              if (typeof companyData?.address==='undefined') { 
                // there isn't even a registered company to sign message!
                throw new Error('only_ownerrfp_doctpye');
              }
              // show signature message needed to identify as issuer at server,this cause the flow will follow from
              //  another segment of the code to get signature and download file
              setShowSignMsg(true); 
              // we're done here, flow will continue when user clicks on handleSigning button handler displayed 
              // on SignMsgAlert inner component
              return; 
            } else {
              // Is a PRIVATE file.  Is private until endofreceiving date, after hat is public
              // we won't need to sign, so go ahead and decryt it
              processDownload();
            }
      } else {
        // is a PUBLIC document (RFP request documents). It's not encrypted and is available as soon as is uploaded to arweave
        // so go and  delivered it
        const filePath = `https://arweave.net/${file.idx}`
        saveBlobAsFile("filePath", filePath, null, file.name);
      }
    } catch (error) {
      reject({msg:error.message}) // we use reject because is in the scope of this function
    }
    });
  };

  const handleSigning = async () => {
    setShowSignMsg(false);
    const { globalIndex, arweaveFileIdx } = params.current;
    // prepare object params for signing
    const message = JSON.stringify({ globalIndex, arweaveFileIdx });
    signMessage(message);
  };

  const statusClass = (status) => {
    const common = 'pl-2 pt-1 flex items-center'
    if (status==='') return common
    switch (status) {
      case '':
      case 'processing':
        return `${common}`
      case 'success':
        return `${common} text-green-700 `
      case 'failure':
        return `${common}  text-red-500`
    }
  }


  const iconStatusClass = (status) => {
    if (status === '') return null
    if (status === 'processing') 
      //return <Image alt="spinningarrow" src="/spinningarrow.svg" height={18} width={18} className="animate-spin"/> 
      return <p className="animate-spin">🗘</p>
    if (status === 'success') return '✓'
    if (status === 'failure') return 'x' 
    return null
  }
const resultAnnounce = (status, file) => {
  if (status==='') return null
  if (status==='processing') return t('downloading_file')
  if (status==='success') return t('downloaded_Ok')
  if (status==='failure') return `Error:  ${file?.msg}`
  return null
}

  //** Inner Components *************************************************************************


 
  const DownloadFilesLogger = () => {
    if (processedFiles.length)
      return (
        <div className="mt-4 py-1 bg-white mb-2 shadow-lg ">
          {processedFiles.map((file, index) => (
            <div key={index} className={`text-sm grid grid-cols-[40%,55%,5%] text-stone-700 border-t border-orange-500`}>
              <div className={`${statusClass(file?.status)} border-r border-l border-orange-500 
              ${index === processedFiles.length -1  ? 'border-b border-orange-500' : ''}`}>
                <p className="truncate">{file?.name}</p>
              </div>
              <div className={`${statusClass(file?.status)} ${index === processedFiles.length -1  ? 'border-b border-orange-500' : ''}`}>
                <p>{resultAnnounce(file?.status, file)}</p>
              </div>
              <div className={`${statusClass(file?.status)} text-center border-r border-l border-orange-500 justify-center text-xl font-bold pb-1
              ${index === processedFiles.length -1  ? 'border-b border-orange-500' : ''}`}>
                <div className={`contents ${file?.status==='processing' ? 'text-orange-500 animate-spin'
                : ''} ${statusClass(file?.status)}` }>{iconStatusClass(file?.status)}</div>
              </div>
            </div>
          ))}

        </div>
      )
    else return (null)
  };
  


  const ComponentLauncher = () => {
    if (!doneLookingFiles)
      return (
        <div
          className="border border-orange-400  font-khula font-bold text-stone-700 h-full
            w-full mb-8  shadow-lg"
        >
          <div className="scale-50 ">
            <Spinner />
          </div>
        </div>
      );
    else return <DownloadComponent />;
  };

  const DownloadComponent = () => {
    if (downloadableFiles.length)
      return (
        <div className=" max-h-[44rem] overflow-y-auto">
          {timerWarning && (
            <p className="absolute p-2  left-[50%] text-center w-[15em] bg-orange-500 text-white">
              {t("Copied_clipboard")}
            </p>
          )}
          
          <table
            className="table-fixed border-collapse border border-orange-400  font-khula font-bold text-stone-700 h-full
             w-full mb-8  shadow-lg">
            <thead className="">
              <tr className="font-khula text-lg text-left text-stone-600 border border-orange-400">
              <th className="w-1/3 px-4 py-2 ">
                <div className="cursor-pointer" onClick={toggleAllEntries}>
                <input type="checkbox" className=" cursor-pointer mr-2 accent-orange-200 " checked={selectAll} onChange={toggleAllEntries}/>
                <strong>{t("document_name")}</strong>
                </div>
              </th>
              <th className="w-5/12 px-4 py-2 ">
                <strong>{t("document_hash")}</strong>
              </th>
              <th className="w-2/12 px-4 py-2   ">
                <strong>{t("doc_type")}</strong>
              </th>
              </tr>
            </thead>
            <tbody className="">
              {downloadableFiles.map((file) => (
                <tr key={file.idx} className={`${file.selected ? 'bg-orange-100' : 'even:bg-stone-100 odd:bg-white'} `}>
                  <td className="flex p-2 truncate ml-7  cursor-pointer"
                    onClick={() => toggleSelectedFile(file) }
                  >
                    <div className="">
                     <p className="whitespace-pre text-sm"> {file.name}</p>
                    </div>
                  </td>
                  <td title={t("click_to_Copy_clipboard")}
                    onClick={() => copyclipboard(file.documentHash, file)}
                    className=" truncate   p-2 text-sm  cursor-pointer"
                  >
                    {file.documentHash}
                  </td>
                  <td className=" truncate p-2 text-sm cursor-pointer"
                   onClick={() => toggleSelectedFile(file) }
                   >
                    {t(docTypes[file.docType.toNumber()].desc)} 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    else
      return (
        <div className="mt-2 flex items-center justify-center border shadow-lg h-40">
          <p className="whitespace-pre "> - {t("nofiles")} -</p>
        </div>
      );
  };

  // copy the passed text ti clickboard and briefly turn on flag to show message copied to clipboard
  const copyclipboard = (text, file) => {
    navigator.clipboard.writeText(text);
    toggleSelectedFile(file)
    setTimerWarning(true);
    setTimeout(() => setTimerWarning(false), 600);
  };

  return (
    <div className="m-auto py-2 max-w-[90%]  border-[1px] border-orange-200 shadow-md p-4">
      <SignMsgAlert
        showSignMsg={showSignMsg}
        msgWarning={t("show_rfp_filerequest")}
        signMsg={t("signmessage", { ns: "common" })}
        handleSigning={handleSigning}
      />
      <div id="downloadIcon" className="flex">
        <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
        <p className="mt-2 pl-2 font-khula">{t("dowloadrequestfiles")}</p>
      </div>
      <ComponentLauncher />
      <div className="flex justify-center mt-8">
        <button id="downloadAllSelectedFiles"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded mt-4 "
          onClick={handleDownloadAllSelectedFiles}
          >
          {t('download_button')}
        </button>
      </div>
      <div className="mt-6">
        <DownloadFilesLogger />
      </div>
    </div>
  );
};
export default DownloadFileForm;
