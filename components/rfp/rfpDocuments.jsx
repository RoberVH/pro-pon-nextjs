/**
 * RFPDocuments
 *  Component display at homerfp page rigth panel on RFP documents TAB (rfp_bases id)
 *  it display for downloading RFPs documents
 *  If logged account is owner, display component to upload RFP documents
 *  through uploadRFPForm that host functionality for uploading files to arweave thorugh Bundlr
 *
 */
import UploadRFPForm from "../forms/uploadRFPForm";
import DonwloadFileForm from "../forms/donwloadFileForm";

const RFPDocuments = ({ t, rfpfiles, setNewFiles, showUpload, rfpId, rfpIndex, docType, owner }) => {
  let uploadComponent = null;
  if (showUpload) uploadComponent = <UploadRFPForm 
                                        t={t} 
                                        setNewFiles={setNewFiles} 
                                        rfpId={rfpId} 
                                        rfpIndex={rfpIndex}
                                        docType={docType}
                                        owner={owner}
                                      />;
  return (
    <div className="mt-2">
      {uploadComponent}
      <DonwloadFileForm
        rfpfiles={rfpfiles}
        t={t}
        docType={docType}
        owner={owner}
      />
    </div>
  );
};
export default RFPDocuments;
