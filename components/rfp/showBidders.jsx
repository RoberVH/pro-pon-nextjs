
/**
 * ShowBidders
 *  Show all current bidders and uploaded documents and (dates of uploading?)
 *  Show File picker component in current bidder if its a participant and is current account logged
 *  The payment for the uploading to arweave is from propon server account and if its invitation contest
 *  will be paid by RFP owner. If Open, then when registering the participant will pay for it
 */

import { useEffect, useState } from "react";
import  BiddersFilesCompo  from "./BiddersFilesCompo";
import  Image  from 'next/image'
import UploadRFPForm from '../forms/uploadRFPForm'
import { docTypes, IdxDocTypes } from "../../utils/constants";


const allowedDocTypes = [
    docTypes[IdxDocTypes['documentProposalType']],
    docTypes[IdxDocTypes['documentPricingOfferingType']],
    docTypes[IdxDocTypes['documentLegalType']],
    docTypes[IdxDocTypes['documentFinancialType']],
    docTypes[IdxDocTypes['documentAdministrativeType']]
]
const ShowBidders = ({address, owner, companies, setNewFiles, rfpIndex, rfpId, rfpfiles, t}) => {
    const [idxShowFilesComp, setidxShowFilesComp] = useState(null) // index of open Files Compo

const CellTable= ({field}) =>
    <td className="w-1/4 p-2  font-khula text-stone-800">
        {field}
    </td>;

    const toggleUploadComponent = (companyId) => {
        setidxShowFilesComp(companyId)
    }
    return (
    <div className="m-2">
      <table className="w-full text-left">
        <tbody>
        {companies?.length ?
            companies.map(company => 
            <>
              <tr key={company._id} className={`${company.companyId!==idxShowFilesComp ? "border-b-2 border-orange-400":null}`}>
                <CellTable field={company.companyId} />
                <CellTable field={company.companyname} />
                <CellTable field={company.country} />
                <td className="w-1/4 p-2 text-lg font-khula 
                text-gray-700 text-right pr-4">
                { idxShowFilesComp===company.companyId ? 
                    <Image  className="cursor-pointer"
                        onClick = {() => toggleUploadComponent(null)}
                        alt="V" src={'/dash.svg'} width={22} height={22}>
                    </Image>
                    :
                    <Image  className="cursor-pointer"
                         onClick = {() => toggleUploadComponent(company.companyId)}
                        alt="V" src={'/chevrondown2.svg'} width={22} height={22}>
                    </Image>
                }
                </td>
              </tr>
              {(idxShowFilesComp ===company.companyId ) &&
              <>
                { address.toLowerCase()=== company.address.toLowerCase() &&
                <tr key={`${company._id}-uploadfiles`}>
                   <td colSpan={4}  > 
                          <UploadRFPForm
                            t={t}
                            setNewFiles={setNewFiles}
                            rfpId={rfpId}
                            rfpIndex={rfpIndex}
                            allowedDocTypes={allowedDocTypes}
                            owner={owner}
                        />
                  </td>
                </tr>
                }
                <tr key={`${company._id}-downloadfiles`} className="">
                  <td colSpan={4} className="p-2 ">
                  <BiddersFilesCompo bidderAddress={company.address} rfpfiles={rfpfiles}/>
                  </td>
                </tr>
               </>
               }
            </>)
            :
            <tr key='nobidders'>
                <td>
                <p>NO BIDDERS</p>
            </td>
            </tr>
        }
        </tbody>
      </table>
    </div>
    )
};
export default ShowBidders;