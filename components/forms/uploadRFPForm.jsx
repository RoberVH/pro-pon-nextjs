/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { Fragment, useState, useEffect, useCallback, useContext } from "react"
import PickFilesForm from "./pickFilesForm"
import DisplayProgressUpload from "./displayProgressUpload"
import BottomSignMsg from "../layouts/bottomSignMsg"
import { getPresignedHash, getRmteBndlr } from "../../web3/getRmteBbndlr";
import { DocumentIcon } from "@heroicons/react/outline"
import { uploadBlockchainFile } from '../../utils/uploadBlockchainFile'
import { proponContext } from "../../utils/pro-poncontext"
import { ArweavefileTypes } from '../../utils/constants'
// toastify related imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from "../../styles/toastStyle";

function UploadRFPForm({ t, setFiles, rfpId }) {
  const [dropingFiles, setDroppintFiles] = useState(false); // controls if user is dragging files over drop zone
  const [pickedFiles, setPickedFiles] = useState([]); // state var for child pickFIlesForm let us know files are pickedup
  const [Error, setError] = useState();
  const [progressPrctge, setProgressPrctge] = useState([]);
  const [totalSize, setTotalSize] = useState();
  const [hashSet, setHashSet] = useState([]);

  //const [remoteBundlr, setRemoteBundlr] = useState();
  const [remoteBundlrBalance, setRemBndlrBal] = useState();
  //callback setFiles for processing at parent control
  const [uploading, setUploading] = useState(false);

  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const { companyData, address } = useContext(proponContext);

  useEffect(() => {
    const getRFPfromContract = async () => {
      if (address) check;
    };
  }, []);

  useEffect(() => {
    if (pickedFiles.length > 0) uploadArweave(pickedFiles);
  }, [pickedFiles, uploadArweave]);

  const uploadArweave = useCallback(
    async (pickedFiles) => {
      // Check Bundlr upload price and compare to server account balance
      // if not ok should ask server to make transfer
      const RmteBundlr = await getRmteBndlr();
      const price = await RmteBundlr.getPrice(totalSize);
      const decimalBalance = RmteBundlr.utils.unitConverter(price);
      console.log("%c Converted price: ","color:red; font.size:15px;background-color:cyan;",decimalBalance.toString(),
            "of total file size:",totalSize);
      //!!!!!! here some checking of paying (server) account Bundrl balance should be made and process rightly
      const sizeBatch=Array(pickedFiles.length).fill(0);
      setProgressPrctge(sizeBatch);
      setHashSet(sizeBatch)
    //   const dataFiles = pickedFiles.map((file, indx) =>
    //     readFile(file, "readAsArrayBuffer", setProgressPrctge, indx)
    //   );
    //   console.log('dataFiles',dataFiles)
    //   const resultdataFiles = Promise.all(dataFiles)
    //   console.log ('resultdataFiles',resultdataFiles)
    //   const xf1 = await resultdataFiles
    // console.log ('promesas xf1', xf1)
    // return {status:false}
      const processFilePromisesArray = pickedFiles.map((file, indx) => 
          uploadBlockchainFile( file, indx,setProgressPrctge, address,rfpId, setHashSet,RmteBundlr, ArweavefileTypes.requestFile )
        )
        console.log('processFilePromisesArray',processFilePromisesArray)
      const resultFilesPromises = Promise.all(processFilePromisesArray)
      const dataFileContent = await resultFilesPromises
      return;
      const transaction = remoteBundlr.createTransaction(fileData, { tags });
      // get signature data
      const signatureData = Buffer.from(await transaction.getSignatureData());
      // get signature signed by the paying server
      try {
        const resp = await fetch("/api/serversigning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            datatosign: Buffer.from(signatureData).toString("hex"),
          }),
        });
        const resp2 = await resp.json();
        const signed = Buffer.from(resp2.signeddata, "hex");
        //  add signed signature to transaction
        transaction.setSignature(signed);

        const res = await transaction.upload();
        console.log("res", res);
        return { status: true, txid: res.id };
      } catch (error) {
        console.log("Error", error);
        return { status: false };
      }
    },
    [totalSize]
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
  else if (progressPrctge.length > 0)
    return (
      <div className="my-8 mx-4 font-khula bg-white leading-8 ">
        <DisplayProgressUpload
          t={t}
          files={pickedFiles}
          progressPrctge={progressPrctge}
          hashSet={hashSet}
        />
      </div>
    );
  return null;
}

export default UploadRFPForm;
