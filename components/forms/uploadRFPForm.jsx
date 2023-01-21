/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import PickFilesForm from "./pickFilesForm";
import DisplayProgressUpload from "./displayProgressUpload";
import { uploadBlockchainFiles } from "../../utils/uploadBlockchainFiles";
// import BottomSignMsg from "../layouts/bottomSignMsg"
import { getRmteBndlr } from "../../web3/getRmteBndlr";
import { ArweavefileTypes } from "../../utils/constants";
import { parseWeb3Error } from "../../utils/parseWeb3Error";
// toastify related imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";
import { sendWarningServer } from "../../utils/misc";
import { useWriteFileMetadata } from "../../hooks/useWriteFileMetadata";

/**
 *  UploadRFPForm
 *  Pick RFP request files from user, upload them to arweave, record their metadata to contract
 *  Props:
 *      t - Translator function
 *      setNewFiles - boolean flag to indicate parent component there are new RFP files
 *      rfpId - Id from RFP database record
 *      rfpIndex - Global index on Contract var array RFPs of current RFP
 *
 */
function UploadRFPForm({ t, setNewFiles, rfpId, rfpIndex, allowedDocTypes, owner }) {
  // state var for child pickFIlesForm let us know files are pickedup
  const [pickedFiles, setPickedFiles] = useState([]); 
  const [uploadingSet, setuploadingSet] = useState([]);
  const [totalSize, setTotalSize] = useState();
  const [successFiles, setSuccessFiles] = useState([]);
  const [showCalltoRecordBlockchain, setshowCalltoRecordBlockchain] = useState(false);
  const [filesWithErrors, setfilesWithErrors] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendingBlockchain, setsendingBlockchain] = useState(false);

  const router = useRouter();

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const { write, postedHash, block, link, blockchainsuccess } = useWriteFileMetadata(onError);

  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setUploading(false);
    setsendingBlockchain(false);
  }

  const ShowSummaryUploads = () => (
    <>
      <p>
        {" "}
        <strong>{`${successFiles.length}`} </strong> {t("files_uploaded")}{" "}
      </p>
      {filesWithErrors && <p>{t("tell_hover_errors")}</p>}
      {successFiles.length > 0 && <p>{t("call_to_record_files")}</p>}
      {postedHash && <p>{t("rfpessentialdataposted")}</p>}
      {link && (
        <div>
          <label>{t("chekhash")}</label>
          <a
            className=" text-blue-600 "
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {`${postedHash.slice(0, 10)}...${postedHash.slice(-11)}`}
          </a>
        </div>
      )}
      {block && (
        <div>
          <label>{t("block")} </label>
          <label className="text-blue-600">&nbsp;{block}</label>
        </div>
      )}
      <div className="flex my-4 mx-auto ">
        <button onClick={recordRFPMetadatatoContract} className="main-btn ">
          {!sendingBlockchain ? (
            <span> {t("accept")} </span>
          ) : (
            <div className=" flex justify-evenly items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white-900"></div>
              <p className="pl-4"> ...&nbsp;{t("savingstate")}</p>
            </div>
          )}
        </button>
        {(sendingBlockchain || block) && (
          <button onClick={handleClose} className="secondary-btn ml-16">
            {t("closebutton")}
          </button>
        )}
      </div>
    </>
  );

  // alert parent component homeRFP there are new RFP files it must update for all child components
  useEffect(() => {
    if (blockchainsuccess) {
      setNewFiles(true)
      setUploading(false)
      setSuccessFiles([])
    }
  }, [blockchainsuccess, setNewFiles]);

  useEffect(() => {
    if (pickedFiles.length > 0) uploadArweave(pickedFiles);
  }, [pickedFiles, uploadArweave]);

  /**
   * savetoContractUploadedFiles
   *  Check if there are Files saved to Arweave and proceeed to record their metadata to Contract
   *   Save to contract a record of files uploaded to arweave:
   *      setUploaded - record with hash, rfpid and Bundlr/arweave Id uploaded files
   *      owner - owner of file uploaded
   *  Otherwise set screen to initial state (i.e. no picked up files)
   */
  const recordRFPMetadatatoContract = async () => {
    if (successFiles.length === 0) {
      setPickedFiles([]); // back to square 0
      return;
    }
    if (blockchainsuccess) return; // we already have done our job
    setsendingBlockchain(true);
    // let's upload to Contrat
    // create params arrays for createRFP contract method
    const nameArray = uploadingSet
      .filter((doc) => doc.status === "success")
      .map((filtered) => filtered.name);
    const hashArray = uploadingSet
      .filter((doc) => doc.status === "success")
      .map((filtered) => filtered.hash);
    const fileIdArray = uploadingSet
      .filter((doc) => doc.status === "success")
      .map((filtered) => filtered.fileId);
      const docTypesArray= uploadingSet   // Pendiente por agregar en uploading !!!!!!!!!!!!!!!!!!!!
      .filter((doc) => doc.status === "success")
      .map((filtered) => filtered.DocType);
    try {
      // write metadata files to contract
      await write(rfpIndex, docTypesArray, nameArray, hashArray, fileIdArray);
    } catch (error) {
      console.log(error);
    } finally {
      setsendingBlockchain(false);
    }
  };

  /**
   * uploadArweave
   *  Create an array of promises that read file & load them to Bundlr, as reporting a displayProgress compo
   *  In display progress component show succesful/error of operations.
   *  After it finish, call savetoContractUploadedFiles passing object with saved to Bundlr files
   *  to register to Smart Contract the RFPId, file name, owner, arweave Ids and hash of files
   */
  const uploadArweave = useCallback(
    async (pickedFiles) => {
      setUploading(true);
      // Check Bundlr upload price and compare to server account balance
      // if not ok should ask server to make transfer
      const RmteBundlr = await getRmteBndlr();
      const amount = await RmteBundlr.getPrice(totalSize);
      const price = RmteBundlr.utils.unitConverter(amount);
      const funded = await RmteBundlr.getLoadedBalance();
      const bal = RmteBundlr.utils.unitConverter(funded);
      // prepare uploading Objects Array to receive back events, errors and results of following promises called
      const rmteBalNum = bal.toNumber();
      if (price > rmteBalNum) {
        errToasterBox(t("no_serverBundlr_funding", { ns: "gralerrors" }));
        sendWarningServer(
          "Bundler_Server_Funding_low",
          `has: ${rmteBalNum}, requested: ${price}`
        );
        return;
      }
      // resize  uploadingSet var as object array  with a length of picked files and add status prop to each object
      // so we'll be adding properties as upload progress (hash, error, etc.)
      setuploadingSet(Array(pickedFiles.length).fill({ status: "pending" }));
      try {
        const processFilePromisesArray = pickedFiles.map((file, indx) =>
          uploadBlockchainFiles(
            setuploadingSet,
            file,
            indx,
            owner,
            rfpId,
            RmteBundlr,
            ArweavefileTypes.requestFile,
            rfpIndex
          )
        );
        const resultFilesPromises = await Promise.allSettled(
          processFilePromisesArray
        );
        // const dataFileContent = await resultFilesPromises;
        await resultFilesPromises;
        const fullfilled = resultFilesPromises.filter((result) => result.status === "fulfilled");
        setfilesWithErrors(Boolean(resultFilesPromises.length - fullfilled.length));
        setSuccessFiles(fullfilled);
        setshowCalltoRecordBlockchain(true);
      } finally {
        setUploading(false);
      }
    },
    [totalSize, owner, rfpId,rfpIndex, t]
  );

  const PickupComponent = (
    <div>
      <PickFilesForm
        t={t}
        errToasterBox={errToasterBox}
        setPickedFiles={setPickedFiles}
        setTotalSize={setTotalSize}
        allowedDocTypes={allowedDocTypes}
      />
    </div>
  );

  const handleClose = () => {
    router.push({ pathname: "/" });
  };

  if (!Boolean(pickedFiles.length))
    return (
      <div className="my-8 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-orange-200 shadow-md">
        {PickupComponent}
      </div>
    );
  else if (uploadingSet.length > 0)
    return (
      <div className="my-8 mx-4 font-khula bg-white leading-8 ">
        <DisplayProgressUpload
          t={t}
          files={pickedFiles}
          uploadingSet={uploadingSet}
        />
        <div className=" flex flex-col my-4 p-2 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-gray-200 shadow-md">
          {showCalltoRecordBlockchain && <ShowSummaryUploads />}
        </div>
      </div>
    );
  return null;
}

export default UploadRFPForm;
