
import UploadRFPForm from "../forms/uploadRFPForm";
import DonwloadFileForm from "../forms/donwloadFileForm";


const RequestRFPDocuments = ({t, rfpfiles, setFiles, showUpload}) => {
    let uploadComponent=null;
  if (showUpload) uploadComponent= (<UploadRFPForm t={t} setFiles={setFiles}/>)
  return (
        <div className="mt-2">
            {uploadComponent}
            <DonwloadFileForm files={rfpfiles} t={t} />
        </div>
    )
};
export default RequestRFPDocuments;