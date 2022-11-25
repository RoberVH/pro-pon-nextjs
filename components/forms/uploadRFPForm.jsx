/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { useState, useEffect, useCallback, useContext } from "react"
import PickFilesForm from "./pickFilesForm"
import DisplayProgressUpload from "./displayProgressUpload"
import { uploadBlockchainFile } from "../../utils/uploadBlockchainFile"
// import BottomSignMsg from "../layouts/bottomSignMsg"
 import { getRmteBndlr } from "../../web3/getRmteBndlr"
import { proponContext } from "../../utils/pro-poncontext"
import { ArweavefileTypes } from '../../utils/constants'
// toastify related imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";
import { sendWarningServer } from '../../utils/misc'
import { setResultObject } from "../../utils/setResultObject"

function UploadRFPForm({ t, setFiles, rfpId }) {
  const [dropingFiles, setDroppintFiles] = useState(false) // controls if user is dragging files over drop zone
  const [pickedFiles, setPickedFiles] = useState([]) // state var for child pickFIlesForm let us know files are pickedup
  // const [Error, setError] = useState()
  const [uploadingSet,setuploadingSet]= useState([])
  const [totalSize, setTotalSize] = useState()
  //const [finishedPromises, setFinishedPromises] = useState(false)

  //const [remoteBundlr, setRemoteBundlr] = useState()
  //const [remoteBundlrBalance, setRemBndlrBal] = useState()
  //callback setFiles for processing at parent control
  const [uploading, setUploading] = useState(false)

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle)
  };

  const { companyData, address } = useContext(proponContext)

  useEffect(() => {
    const getRFPfromContract = async () => {
      if (address) check;
    };
  }, []);

  useEffect(() => {
    if (pickedFiles.length > 0) uploadArweave(pickedFiles);
  }, [pickedFiles, uploadArweave]);

  /**
 * savetoContractUploadedFiles
 *   Save to contract a record of files uploaded to arweave:
 *      setUploaded - record with hash, rfpid and Bundlr/arweave Id uploaded files
 *      address - owner of file uploaded
 */
  const savetoContractUploadedFiles =(setUploaded) => {
    console.log('setUploaded',setUploaded)
    // contract call 
    /*addDocument (uint _rfpIdx, uint8 _docType, string memory _name,string memory _documentHash, 
        string memory _path) */
  }

  // uploadArweave
  // Create an array of promises that read file & load them to Bundlr, as reporting a displayProgress compo
  // In display progress component show succesful/error of operations.
  //  After it finish, call savetoContractUploadedFiles passing object with saved to Bundlr files
  // to register to Smart Contract the RFPId, file name, owner, arweave Ids and hash of files

  const uploadArweave = useCallback(
    async (pickedFiles) => {
      setUploading(true)
      // Check Bundlr upload price and compare to server account balance
      // if not ok should ask server to make transfer
      const RmteBundlr = await getRmteBndlr();
      const amount = await RmteBundlr.getPrice(totalSize);
      const price = RmteBundlr.utils.unitConverter(amount);
      const funded = await RmteBundlr.getLoadedBalance()
      const bal = RmteBundlr.utils.unitConverter(funded)
      console.log("%c Converted price: ","color:red; font.size:15px;background-color:cyan;",price.toNumber(),
            "of total file size:",totalSize, 'Funded: ',bal.toNumber());
      //!!!!!! here some checking of paying (server) account Bundrl balance should be made and process rightly
      // prepare uploading Objects Array to receive back events, errors and results of following promises called
      const rmteBalNum = bal.toNumber()
      console.log('remote bundlr balance:', rmteBalNum)
      if (price < rmteBalNum) {
        errToasterBox(t('no_serverBundlr_funding',{ns:"gralerrors"}))
        sendWarningServer('Bundler_Server_Funding_low', `has: ${rmteBalNum}, requested: ${price}`)
        return
    }
      setuploadingSet(Array(pickedFiles.length).fill({status:'pending'}))
      try {
      const processFilePromisesArray = pickedFiles.map((file, indx) => 
          uploadBlockchainFile(setuploadingSet, file, indx,address,rfpId, RmteBundlr, ArweavefileTypes.requestFile)
        )
        console.log('processFilePromisesArray',processFilePromisesArray)
       const resultFilesPromises = await Promise.allSettled(processFilePromisesArray)
      // const dataFileContent = await resultFilesPromises
      const fullfilled = resultFilesPromises.filter(result => result.status === "fulfilled");
      // Now saved to blockchain contract record of the succesful uploaded files
      savetoContractUploadedFiles(uploadingSet)
    } finally { setUploading(false)
    }
    },[totalSize, address ,rfpId]
  );

  const PickupComponent = (
    <div>
      <PickFilesForm
        t={t}
        errToasterBox={errToasterBox}
        setPickedFiles={setPickedFiles}
        setTotalSize={setTotalSize}
      />
    </div>
  );

  if (!Boolean(pickedFiles.length))
    return (
      <div className="my-8 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-orange-200 shadow-md">
        {PickupComponent}
      </div>
    );
  else if (uploadingSet.length > 0)
    return (
      <div className="my-8 mx-4 font-khula bg-white leading-8 ">
        {console.log('uploadingSet',uploadingSet)}
        <DisplayProgressUpload
          t={t}
          files={pickedFiles}
          uploadingSet={uploadingSet}
        />
      </div>
    );
  return null;
}

export default UploadRFPForm;
