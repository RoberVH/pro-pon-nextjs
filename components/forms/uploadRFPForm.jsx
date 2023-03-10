/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { useState, useEffect, useCallback, useContext } from "react";
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
  isInTime
}) {
  // state var for child pickFIlesForm let us know files are pickedup
  const [pickedFiles, setPickedFiles] = useState([]);
  const [uploadingSet, setuploadingSet] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [successFiles, setSuccessFiles] = useState([]);
  const [showSummaryUploads, setShowSummaryUploads] = useState(false);
  const [filesWithErrors, setfilesWithErrors] = useState(false);
  //const [uploading, setUploading] = useState(false);
  const [sendingBlockchain, setsendingBlockchain] = useState(false);

  const router = useRouter();

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const { write, postedHash, block, link, blockchainsuccess } =
    useWriteFileMetadata(onError);

  // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setsendingBlockchain(false);
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

      <div className="flex mt-4 mb-2 mx-auto ">
        <button onClick={handleClose} className="secondary-btn ml-4">
          {t("closebutton")}
        </button>
      </div>
      {sendingBlockchain && 
          <div className="mt-4  ">
            <div className="p-6 mx-auto">
              <SpinnerBar msg={t('uploading_metadata')}/>
            </div>
          </div>
        }
    </>
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
  )
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
    // si successFiles es cero, no debes poner setPickFiles a cero, hay que esperar que usuario revise errores
    // y en boton de cerrar si poner a [] par avolver a inicio Tambien otros arreglso habria que reinicializarlos

    const { nameArray, hashArray, fileIdArray, docTypeArray } =
      getMetadataVectors(uploadingSet);

    setuploadingSet((prev) =>
      prev.map((item) => ({
        ...item,
        progress: 90,
      }))
    );

    try {
      // write metadata files to contract
      await write(rfpIndex, docTypeArray, nameArray, hashArray, fileIdArray);
      setuploadingSet((prev) =>
        prev.map((item) => ({
          ...item,
          progress: 100,
        }))
      );
    } catch (error) {
      console.log('write metadata',error);
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
      // setuploadingSet(Array(pickedFiles.length).fill({ status: "pending" }));
      // setShowSummaryUploads(true)
      // return
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
        const processFilePromisesArray = pickedFiles.map((file, indx) =>
          uploadBlockchainFiles(
            setuploadingSet,
            file, // file object record, contains property originalFile with value of user selected File object
            indx,
            owner,
            RmteBundlr,
            file.docType,
            //ArweavefileTypes.requestFile,
            rfpIndex
          )
        );
        const resultFilesPromises = await Promise.allSettled(
          processFilePromisesArray
        );
        // const dataFileContent = await resultFilesPromises;
        await resultFilesPromises;
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
    [totalSize, owner,  rfpIndex, t]
  );

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
  
  //JSX returned begins here    ********************************************************************
  if (!Boolean(pickedFiles.length))
    return (
      <div id="pickupcomponentholder" className="my-8 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-orange-200 shadow-md">
        <PickupComponent />
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

        <div className=" flex flex-col my-4 p-2 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-orange-200 shadow-xl">
          {showSummaryUploads && <ShowSummaryUploads />}
        </div>
      </div>
    );
  return null;
}

export default UploadRFPForm;
