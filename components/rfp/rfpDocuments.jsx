/*
 * RFPDocuments
 *   @param {Object} props - The properties for the RFPDocuments component.
 *   @param {Function} props.t - The translation function for internationalization.
 *   @param {Array} props.rfpfiles - An array of RFP files.
 *   @param {Function} props.setNewFiles - A function to set bool flag for new files uploading  for the RFP.
 *   @param {boolean} props.showUpload - A flag indicating whether the file upload form should be displayed.
 *   @param {string} props.rfpId - The ID of the RFP.
 *   @param {number} props.rfpIndex - The index of the RFP in the list of RFPs.
 *   @param {string} props.docType - The record type of document being displayed.
 *   @param {Object} props.owner - The owner account address for the RFP.
 *   @returns {JSX.Element} - The rendered RFPDocuments component.
 *    Component display at homerfp page rigth panel on RFP documents TAB (rfp_bases id)
 *    it display for downloading RFPs documents types ('documentRequestType' and 'documentQandAType')
 *    If logged account is owner, display component to upload RFP documents
 *    through uploadRFPForm that host functionality for uploading files to arweave thorugh Bundlr
 *
 */

import {  useEffect } from 'react'
import { useFilesRFP } from "../../hooks/useFilesRFP";
import UploadRFPForm from "../forms/uploadRFPForm"
import DownloadFileForm from "../forms/downloadFileForm"
import { convUnixEpoch } from "../../utils/misc";
import { toastStyle } from "../../styles/toastStyle";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { docTypes, IdxDocTypes } from "../../utils/constants";


const allowedDocTypes = [
    docTypes[IdxDocTypes['documentRequestType']],
    docTypes[IdxDocTypes['documentQandAType']],
]

const RFPDocuments = ({
  t,
  showUpload,
  // rfpId,
  rfpIndex,
  rfpDates,
  owner,
}) => {
  const { setNewFiles, rfpfiles, updateRFPFilesArray, doneLookingFiles } = useFilesRFP(rfpIndex);

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle
    });
  };
  const isDateAllowed = () => {
    const rightNow = convUnixEpoch(new Date());
    return rfpDates[0] < rightNow && rightNow < rfpDates[1];
  };

/** Hooks ********************************************************************** */
useEffect(()=>{
  async function getFilesData() {
    const result = await updateRFPFilesArray()
    if (!result.status) errToasterBox(result.message)
  }
  getFilesData()
},[])

  let uploadComponent = null;

  if (showUpload)
    uploadComponent = (
      <UploadRFPForm
        t={t}
        setNewFiles={setNewFiles}
        // rfpId={rfpId}
        rfpIndex={rfpIndex}
        allowedDocTypes={allowedDocTypes}
        owner={owner}
        isInTime={isDateAllowed()}
      />
    );

  return (
    <div className="mt-2">
      {uploadComponent}
      <DownloadFileForm
        rfpfiles={rfpfiles}
        t={t}
        allowedDocTypes={allowedDocTypes}
        owner={owner}
        doneLookingFiles={doneLookingFiles}
      />
    </div>
  );
};
export default RFPDocuments;
