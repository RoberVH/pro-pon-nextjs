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
 *    it display for downloading RFPs documents
 *    If logged account is owner, display component to upload RFP documents
 *    through uploadRFPForm that host functionality for uploading files to arweave thorugh Bundlr
 *
 */

import UploadRFPForm from "../forms/uploadRFPForm"
import DownloadFileForm from "../forms/downloadFileForm"

import { docTypes, IdxDocTypes } from "../../utils/constants";


const allowedDocTypes = [
    docTypes[IdxDocTypes['documentRequestType']],
    docTypes[IdxDocTypes['documentQandAType']],
    docTypes[IdxDocTypes['documentContract']],
]

const RFPDocuments = ({
  t,
  rfpfiles,
  setNewFiles,
  showUpload,
  rfpId,
  rfpIndex,
  docType,
  owner,
}) => {
  let uploadComponent = null;

  if (showUpload)
    uploadComponent = (
      <UploadRFPForm
        t={t}
        setNewFiles={setNewFiles}
        rfpId={rfpId}
        rfpIndex={rfpIndex}
        allowedDocTypes={allowedDocTypes}
        owner={owner}
      />
    );

  return (
    <div className="mt-2">
      {uploadComponent}
      <DownloadFileForm
        rfpfiles={rfpfiles}
        t={t}
        docType={docType}
        owner={owner}
      />
    </div>
  );
};
export default RFPDocuments;
