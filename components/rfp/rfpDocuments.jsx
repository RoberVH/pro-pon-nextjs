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

const RFPDocuments = ({ t, rfpfiles, setFiles, showUpload, rfpId }) => {
  let uploadComponent = null;
  if (showUpload) uploadComponent = <UploadRFPForm t={t} setFiles={setFiles} rfpId={rfpId} />;
  return (
    <div className="mt-2">
      {uploadComponent}
      <DonwloadFileForm
        files={rfpfiles}
        nofiles={t("nofiles")}
        title={t("dowloadrequestfiles")}
      />
    </div>
  );
};
export default RFPDocuments;
