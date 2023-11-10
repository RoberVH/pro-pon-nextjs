/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import PickFilesForm from "./pickFilesForm";
import DisplayProgressUpload from "./displayProgressUpload";
import { uploadBlockchainFiles } from "../../utils/uploadBlockchainFiles";
import { getRmteBndlr } from "../../web3/getRmteBndlr";
import { parseWeb3Error } from "../../utils/parseWeb3Error";

// toastify related imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";
import { sendWarningServer } from "../../utils/misc";
import { useWriteFileMetadata } from "../../hooks/useWriteFileMetadata";
import { todayUnixEpoch } from "../../utils/misc";
import Spinner from "../layouts/Spinner";
import SpinnerBar from "../layouts/SpinnerBar";

/**
 *  UploadRFPForm
 *  Pick RFP request files from user, upload them to arweave, record their metadata to contract
 *  Props:
 *      t - Translator function
 *      setNewFiles - boolean flag to indicate parent component there are new RFP files
 *      rfpIndex - Global index on Contract var array RFPs of current RFP
 *      allowedDocTypes - array with DocTypes allowed for this uploading box,
 *      owner       - address of owner of RFP (the issuer)
 *      isInTime    - Boolean flagging if is on time for upload operation
 *
 */
function UploadRFPForm({
  t,
  setNewFiles,
  rfpIndex,
  allowedDocTypes,
  owner,
  isInTime,
  setNoticeOff,
}) {
  // state var for child pickFIlesForm let us know files are pickedup
  const [pickedFiles, setPickedFiles] = useState([]);
  const [uploadingSet, setuploadingSet] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [successFiles, setSuccessFiles] = useState([]);
  const [showSummaryUploads, setShowSummaryUploads] = useState(true);
  const [filesWithErrors, setfilesWithErrors] = useState(false);
  const [sendingBlockchain, setsendingBlockchain] = useState(false);
  const [droppedTx, setDroppedTx] = useState();
  const [processingTxBlockchain, setProTxBlockchain] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const router = useRouter();

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const { write, postedHash, block, blockchainsuccess } = useWriteFileMetadata(
    onError,
    isCancelled,
    setProTxBlockchain
  );

  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setsendingBlockchain(false);
    // coulnd't write metadata, clean everything
    setuploadingSet([]);
    setSuccessFiles([]);
    setTotalSize(0);
    setsendingBlockchain(false);
    setfilesWithErrors(false);
    setPickedFiles([]);
  }

  // utility functions ********************************************************************************************
  const getMetadataVectors = (uploadingSetArray) => {
    const nameArray = [];
    const hashArray = [];
    const fileIdArray = [];
    const docTypeArray = [];
    uploadingSetArray.forEach(({ status, name, hash, fileId, docType }) => {
      if (status === "success") {
        nameArray.push(name);
        hashArray.push(hash);
        fileIdArray.push(fileId);
        docTypeArray.push(docType);
      }
    });
    return { nameArray, hashArray, fileIdArray, docTypeArray };
  };

  // Inner components   *********************************************************************************************
  const ShowSummaryUploads = () => (
    <div className="p-4 text-warnings font-work-sans">
      <div className="flex text-warnings">
        <p className="pr-1">
          <strong>{`${successFiles.length}`} </strong>
        </p>
        <p className="text-red-600">
          {" "}
          <strong> {t("files_uploaded")}</strong>
        </p>
      </div>

      {filesWithErrors && <p>{t("tell_hover_errors")}</p>}
      {successFiles.length > 0 && <p>{t("call_to_record_files")}</p>}
      {postedHash && <p>{t("rfpessentialdataposted")}</p>}
      {postedHash && (
        <div className="text-warnings label-warnings">
          <label>{t("chekhash")}</label>
          <a
            className=" text-blue-600 lg:text-xs xl:text-sm"
            href={`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${postedHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${postedHash.slice(0, 10)}...${postedHash.slice(-11)}`}
          </a>
        </div>
      )}
      {block && (
        <div className="text-warnings label-warnings">
          <label>{t("block")} </label>
          <label className="text-blue-600">&nbsp;{block}</label>
        </div>
      )}
      {!blockchainsuccess && (
        <div className="mt-4  ">
          <div className="p-6 mx-auto">
            <SpinnerBar msg={t("uploading_metadata")} />
            <div className="flex justify-center mt-2">
              <p className=" text-orange-400 font-bold pl-12">
                {t("waiting_transaction")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex mt-8 mb-2 justify-center ">
        {blockchainsuccess && (
          <button onClick={handleClose} className="secondary-btn">
            {t("closebutton")}
          </button>
        )}
        {postedHash && !blockchainsuccess && (
          <button
            title={t("cancel_tx")}
            onClick={handleCancelTx}
            className="txCancel-btn"
          >
            {t("cancelbutton")}
          </button>
        )}
      </div>
    </div>
  );

  const PickupComponent = () => {
    return (
      <div>
        <PickFilesForm
          t={t}
          errToasterBox={errToasterBox}
          setPickedFiles={setPickedFiles}
          setTotalSize={setTotalSize}
          allowedDocTypes={allowedDocTypes}
          isInTime={isInTime}
        />
      </div>
    );
  };

  // Hooks calls **************************

  // Trigger reading and uploading files when user pick some on PickFilesForm
  useEffect(() => {
    if (pickedFiles.length > 0) uploadArweave(pickedFiles);
  }, [pickedFiles, uploadArweave]);

  // Trigger writing to Blockchain the metadata of all the files as soon as they are confirmed to be uploaded to Arweave
  // Contrary to uploading to arweave, this process writes metadata for all succesfully uploaded files at once to keep blockchain gas low
  // so this is another function and not part of uploadArweave function!
  useEffect(() => {
    if (sendingBlockchain) recordRFPMetadatatoContract();
  }, [sendingBlockchain, recordRFPMetadatatoContract]);

  /**
   * savetoContractUploadedFiles
   *  Check if there are Files saved to Arweave and proceeed to record their metadata to Contract
   *   Save to contract a record of files uploaded to arweave:
   *      setUploaded - record with hash and Bundlr/arweave Id uploaded files
   *      owner - owner of file uploaded
   *  Otherwise set screen to initial state (i.e. no picked up files)
   */
  const recordRFPMetadatatoContract = useCallback(async () => {
    // if SuccessFiles length is 0, do not set SetPickFiles to empty, wait for user to review errors on ShowSummaryUploads
    // and on handleClose set arrays to [] to initialize everything and start fresh

    const { nameArray, hashArray, fileIdArray, docTypeArray } =
      getMetadataVectors(uploadingSet);
    // for progress set to 90 percentage of advance as we consider writing metadata to contract the last 10%
    setuploadingSet((prev) =>
      prev.map((item) => ({
        ...item,
        progress: 90,
      }))
    );

    try {
      // write metadata files to contract
      const today = todayUnixEpoch(new Date());
      //save params in case user cancel op and we need to write to Pending Transactions (PendingTx) collection for later reference
      //save to droppedTX the params in case user cancel in the middle
      // Params to be sent to pro-pon contract:
      // type	String	The type of record. In this case, the type is "filesuploadm".
      // date	Number	The date the record was created (right now) .
      // rfpIndex	Number	The index of the RFP in the contract.
      // docTypeArray	Array	An array of the document types for the files being uploaded.
      // nameArray	Array	An array of the names of the files being uploaded.
      // hashArray	Array	An array of the hashes of the files being uploaded.
      // fileIdArray	Array	An array of the file IDs in arweave of the files being uploaded.consultable at www.arweave.net/fileId
      // txHash	String	The hash of the transaction that uploaded the files.
      // sender	String	The address of the sender who uploaded the files.
      const Tx = {
        type: "filesuploadm",
        date: today,
        rfpIndex,
        docTypeArray,
        nameArray,
        hashArray,
        fileIdArray,
      };
      setDroppedTx(Tx);
      // writing essential RFP data to contract

      await write(rfpIndex, docTypeArray, nameArray, hashArray, fileIdArray);
      setuploadingSet((prev) =>
        prev.map((item) => ({
          ...item,
          progress: 100,
        }))
      );
    } catch (error) {
    } finally {
      setsendingBlockchain(false);
    }
  }, [uploadingSet, rfpIndex, write]);

  /**
   * uploadArweave
   *  Create an array of promises that read file & load them to Bundlr, as reporting a displayProgress compo
   *  In display progress component show succesful/error of operations.
   *  After it finish, call savetoContractUploadedFiles passing object with saved to Bundlr files
   *  to register to Smart Contract the RFPId, file name, owner, arweave Ids and hash of files
   */
  const uploadArweave = useCallback(
    async (pickedFiles) => {
      // setUploading(true);
      // Check Bundlr upload price and compare to server account balance
      // if not ok should ask server to make transfer
      const RmteBundlr = await getRmteBndlr();
      const amount = await RmteBundlr.getPrice(totalSize);
      const price = RmteBundlr.utils.unitConverter(amount);
      const funded = await RmteBundlr.getLoadedBalance();
      const bal = RmteBundlr.utils.unitConverter(funded);

      /*** probando */
      //  setuploadingSet(Array(pickedFiles.length).fill({ status: "pending" }));
      //  setShowSummaryUploads(true)
      //  return
      /********* */
      // prepare uploading Objects Array to receive back events, errors and results of following promises called
      // todo: send more info about app state when error occurred: which account was logged, what what trying to do
      // todo: send warning when rmteBalNum is getting low, this in some other monitoring app client
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
      // so we'll be adding properties as upload progress (hash, error, etc.)setShowSummaryUploads
      setuploadingSet(Array(pickedFiles.length).fill({ status: "pending" }));

      try {
        //create an array of promises for each file to upload
        const processFilePromisesArray = pickedFiles.map((file, indx) =>
          uploadBlockchainFiles(
            setuploadingSet,
            file, // file object record, contains property originalFile with value of user selected File object
            indx,
            owner,
            RmteBundlr,
            file.docType,
            rfpIndex
          )
        );
        //wait for all the promises to be completed
        const resultFilesPromises = await Promise.allSettled(
          processFilePromisesArray
        );
        // const dataFileContent = await resultFilesPromises;
        //await resultFilesPromises;
        //resultFilesPromises;
        const fullfilled = resultFilesPromises.filter(
          (result) => result.status === "fulfilled"
        );
        setfilesWithErrors(
          Boolean(resultFilesPromises.length - fullfilled.length)
        );
        setSuccessFiles(fullfilled);
        /******************************* Save metadata of succesfully-loaded files to arweave */
        if (fullfilled.length === 0) return; // nothing to upload end work here

        //get metadata data of succesfully loaded files in vector arrays to write to contract

        // show summary os far and state of writing to contract operation
        setShowSummaryUploads(true);

        // write metadata files to contract trigger writing to Contract via useEffect detection
        setsendingBlockchain(true);
      } finally {
        // setUploading(false);
      }
    },
    [totalSize, owner, rfpIndex, t]
  );

  // ****************  handlers **********************************************************************************
  // initialize state to start again
  const handleClose = () => {
    setuploadingSet([]);
    setSuccessFiles([]);
    setTotalSize(0);
    setsendingBlockchain(false);
    setfilesWithErrors(false);
    setPickedFiles([]);
    //signal reading files to parent component
    setNewFiles(true);
  };

  /**
   *   handleCancelTx -  Record TX to PendingTx DB Collection
   *        If TX is taking long, user can click cancel to abort waiting
   *        Tx still can go through but we won't wait for it
   */
  const handleCancelTx = () => {
    setIsCancelled(true);
    // create a copy of droppedTx object
    const updatedTxObj = { ...droppedTx };
    // update txLink property with the link value
    updatedTxObj.txHash = postedHash;
    // pass updatedTxObj to setNoticeOff function
    setNoticeOff({ fired: true, txObj: updatedTxObj });
    setProTxBlockchain(false);
  };

  //JSX returned begins here    ********************************************************************
  /* comienza debug  */
  if (!Boolean(pickedFiles.length))
    return (
      <div
        id="pickupcomponentholder"
        className="my-8 mx-auto w-5/6 font-work-sans bg-white leading-8 border-2 border-orange-200 shadow-md"
      >
        <PickupComponent />
      </div>
    );
  else if (uploadingSet.length > 0)
    /*termina debug 
   if (true)*/
    return (
      <div className="my-8 mx-4 font-work-sans bg-white leading-8 ">
        <DisplayProgressUpload
          t={t}
          files={pickedFiles}
          uploadingSet={uploadingSet}
        />
        {showSummaryUploads && (
          <div className="fixed inset-0  bg-zinc-100 bg-opacity-80 z-50 flex justify-center ">
            <div
              className="fixed inset-0 bg-white border border-solid border-orange-300 left-1/2 transform -translate-x-1/2 
                    top-1/2 -translate-y-1/2  shadow-md   lg:h-[20em] xl:h-[24] 2xl:h-[26] 3xl:h-[32]"
            >
              <ShowSummaryUploads />
            </div>
          </div>
        )}
      </div>
    );
  else
    return (
      <div className="text-components border-[1px] border-orange-200 pt-8 flex flex-col justify-center">
        <p className="mx-auto text-stone-500 text-components">
          {t("preparing_filesload")}
        </p>
        <div className="scale-50">
          <Spinner />
        </div>
      </div>
    );
  return null;
}

export default UploadRFPForm;
