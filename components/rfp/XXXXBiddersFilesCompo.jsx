import { useContext } from 'react'
import { proponContext } from "../../utils/pro-poncontext"
import { useTranslation } from "next-i18next";
import DownloadFileForm from '../forms/downloadFileForm'
import { toastStyle, toastStyleSuccess } from "../../styles/toastStyle"
import { toast } from "react-toastify"
/**
 * 
 * BiddersFilesCompodocType
 *      Show Bidders uploaded files component with hash only
 */
import { documentResponseType, openContest, inviteContest } from "../../utils/constants";

 function BiddersFilesCompo({bidderAddress,rfpfiles }) {
    const { address } = useContext(proponContext)
    const { t } = useTranslation("rfps")

  // let UploadBidderComponent = null 
  // if (bidderAddress.toLowerCase() ===  address.toLowerCase()) return null
  return (
    <div>
        {/* {UploadBidderComponent} */}
        <DownloadFileForm 
            rfpfiles= {rfpfiles}
            t={t} 
            docTypes={allowedDocTypes}
            owner={bidderAddress} 
        />
        </div>
  )
}
export default  BiddersFilesCompo