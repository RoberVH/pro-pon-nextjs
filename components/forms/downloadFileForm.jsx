import { useState, useContext, useEffect, useRef } from "react";
import { proponContext } from "../../utils/pro-poncontext";
import { useTranslation } from "next-i18next";
import { DownloadIcon } from "@heroicons/react/outline";
import { docTypes, IdxDocTypes } from "../.././utils/constants";
import { useSignMessage } from "../../hooks/useSignMessage";
import { getFileSecrets } from "../../database/dbOperations";
import { SignMsgAlert } from "./../layouts/SignMsgAlert";

//import { readFileArweave } from '../../utils/filesOp'
import Spinner from "../layouts/Spinner";
import { desCipherFile } from "../../utils/zipfiles";
import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import { privateFileTypes, traslatedRFPErrors } from "../../utils/constants";
import { convUnixEpoch } from "../../utils/misc";
import "react-toastify/dist/ReactToastify.css";

/**
  DownloadFileForm
      Displays a table of files names & hashes associated to an RFP for user to download them
*/

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
  const [signedMsj, setSignedMsj] = useState("");
  const [params2, setParams] = useState();

  const params = useRef(null);
  const { t } = useTranslation(["rfps", "signup", "common"]);
  const { companyData } = useContext(proponContext);

  //   hooks ***************************************************************************
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
  // onSuccess When calling sing of hook useSignMessage it will call this callback to continue process or getting document
  async function onSuccess(message, signature) {
    // add message and signature needed properties to params for later use at processDownload
    params.current.message = message;
    params.current.signature = signature;
    processDownload();
  }

  // onError- if error when hook useSignMessage signing process here
  async function onError(error) {
    let customError = t("errors.undetermined_blockchain_error"); // default answer, now check if we can specified it
    if (typeof error.reason !== "undefined") {
      if (error.reason === "insufficient funds for intrinsic transaction cost")
        customError = t("errors.insufficient_funds");
      if (error.reason === "user rejected signing")
        customError = t("errors.user_rejection");
      if (errorSmartContract.includes(error.reason))
        customError = t(`error.${error.reason}`);
    } else {
      if (error.data && error.data.message) customError = error.data.message;
      else if (typeof error.message !== "undefined")
        customError = error.message;
    }
    errToasterBox(customError);
    setSaving(false);
  }

  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
  };

  //************************************* utility functions ********************************************************/

  /**DownloadDocument
   *    Popo prompt for user to select where to save and download file
   */
  const downloadDocument = async (option, filePath, blob, filename) => {
    let url, link;
    switch (option) {
      case "filePath":
        url = filePath;
        const response = await fetch(url);
        const blobFilePath = await response.blob();
        url = URL.createObjectURL(blobFilePath);
        link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        //link.remove();
        URL.revokeObjectURL(url);
        break;
      case "blob":
        url = URL.createObjectURL(blob);
        link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        //link.remove();
        break;
    }
  };

  /**processDownload
   *    This function is called when there is a confidential/private file,
   *    Confidential file is a file only RFP issuer can download after end of receiving date reached
   *    Private file is a  private file until after end of receiving date reached when becomes public
   *    Confidential file must provide message and signature  for the server to validate, if the
   *    requested file is of confidential type (presently Proposal), server will check those values
   *    Anyway, server will check if end of receiving date is reached to deliver both confidential and private secrets
   */
  const processDownload = async () => {
    const {
      globalIndex,
      arweaveFileIdx,
      message = undefined,
      signature = undefined,
    } = params.current;
    let msg = message;
    if (typeof msg !== "undefined") msg = JSON.parse(message); // destringify message
    const requestingFileprops = { globalIndex, arweaveFileIdx, msg, signature };
    try {
      const res = await getFileSecrets(requestingFileprops);
      if (!res.status) throw new Error(res.msg);
      // get the arweave encrypted file
      const response = await fetch(
        `https://arweave.net/${params.current.arweaveFileIdx}`
      );
      const arrayBuffer = await response.arrayBuffer();
      const dataContent = new Uint8Array(arrayBuffer);
      const IVuint8Array = new Uint8Array(
        res.secrets.iv.split(",").map((c) => parseInt(c, 10))
      );
      const decryptedFile = await desCipherFile(
        dataContent,
        res.secrets.psw,
        IVuint8Array
      );
      const blob = new Blob([decryptedFile], {
        type: "application/octet-stream",
      }); // here the content Type
      downloadDocument("blob", null, blob, params.current.filename);
    } catch (error) {
      let msgErr = error.message;
      if (traslatedRFPErrors.includes(error.message)) {
        msgErr = t(error.message);
      }
      errToasterBox(msgErr);
    }
  };

  //************************************handlers  ***********************************************************************/

  /**
   * handleDownload
   *    Verify conditions of file.
   *    if doctype is not private open the file link to arweave
   *    if is ecncrypted check if:
   *        now is greater than ending receiving date? yes -> Is this a technical proposal type? no then desencrypt and open it for user
   *        otherwise don't decrypt and notify user reasons why
   *
   *
   * */
  const handleDownload = async (file) => {
    //eventually add a spinner but beware it won't interfere with displayed signing message
    // get the doctype category of the file: could be a private up to end receiving date or public whenever
    const isPrivateFile = privateFileTypes.includes(
      parseInt(file.docType.toString())
    );
    // first check if date time to download has arrive. this is a courtesy first check, when requesting documents anyway
    // date will be check to avoid local tampering of datetime
    /* remove after this comments DEBUGING ******************************************************************************************/
    if (isPrivateFile && convUnixEpoch(new Date()) <= dateEnd) {
      errToasterBox(t("notimetodownload"));
      return;
    }
    /******************************************************************************************************/
    // if file is of a private type then is encrypted, so check some requirements, download it otherwise
    if (isPrivateFile) {
      // we'll use this param object when asyncronus flow for signing a message and dowloading file comes  on dwl a confidential file
      params.current = {
        docType: file.docType.toString(),
        globalIndex: rfpIndex,
        arweaveFileIdx: file.idx,
        filename: file.name,
      };
      //setParams({docType:file.docType.toString(), globalIndex: rfpIndex, arweaveFileIdx:file.idx, filename:file.name})
      // check if document is confidential (proposal type; only available if end of receiving date reached AND is requested by RFP issuer)
      if (
        parseInt(file.docType.toString()) === IdxDocTypes.documentProposalType
      ) {
        // a confidential file
        if (!companyData.address) {
          errToasterBox(t("only_ownerrfp_doctpye"));
          return;
        }
        setShowSignMsg(true); // show signature warning, the flow will follow from that to get signature and download file
        return;
      } else {
        // PRIVATE file.  a private until endofreceiving date,  but not confidential file, go and download it
        // we won't need to sign, so better pass params object directly
        processDownload();
      }
    } else {
      // is a public document (RFP requesting documents). It's not encrypted just delivered it
      const filePath = `https://arweave.net/${file.idx}`;
      downloadDocument("filePath", filePath, null, file.name);
      //blob = new Blob([dataContent], {type: 'application/octet-stream'}) // here the content Type
    }
  };

  const handleSigning = async () => {
    setShowSignMsg(false);
    const { globalIndex, arweaveFileIdx } = params.current;
    // prepare object params for signing
    const message = JSON.stringify({ globalIndex, arweaveFileIdx });
    signMessage(message);
  };

  //** Inner Components *************************************************************************

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
        <div className=" max-h-[44rem] overflow-y-auto ">
          {timerWarning && (
            <p className="absolute p-2  left-[50%] text-center w-[15em] bg-orange-500 text-white">
              {t("Copied_clipboard")}
            </p>
          )}
          <table
            className="table-fixed border-collapse border border-orange-400  font-khula font-bold text-stone-700 h-full
             w-full mb-8  shadow-lg"
          >
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
                    <div
                      className="flex cursor-pointer"
                      onClick={() => handleDownload(file)}
                    >
                      📥️ &nbsp;
                      <p className="whitespace-pre text-sm"> {file.name}</p>
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
      );
    else
      return (
        <div className="mt-2 flex items-center justify-center border shadow-lg h-40">
          <p className="whitespace-pre "> - {t("nofiles")} -</p>
        </div>
      );
  };

  // copy the passed text ti clickboard and briefly turn on flag to show message copied to clipboard
  const copyclipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTimerWarning(true);
    setTimeout(() => setTimerWarning(false), 600);
  };

  return (
    <div className="m-auto py-2 max-w-[90%] ">
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
    </div>
  );
};
export default DownloadFileForm;
