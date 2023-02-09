/**
 * ShowBidders
 *  Show all current bidders and uploaded documents and (dates of uploading?)
 *  Show File picker component in current bidder if its a participant and is current account logged
 *  The payment for the uploading to arweave is from propon server account and if its invitation contest
 *  will be paid by RFP owner. If Open, then when registering the participant will pay for it
 */

import { useEffect, useState } from "react";
import { useBidders } from "../../hooks/useBidders";
import { useFilesRFP } from "../../hooks/useFilesRFP";

//import  BiddersFilesCompo  from "./BiddersFilesCompo";
import Image from "next/image";
import UploadRFPForm from "../forms/uploadRFPForm";
import DownloadFileForm from "../forms/downloadFileForm";
import Spinner from "../layouts/Spinner";
import { docTypes, IdxDocTypes } from "../../utils/constants";
import { convUnixEpoch } from "../../utils/misc";
import { nanoid } from "nanoid";
// toastify related imports
import { toastStyle } from "../../styles/toastStyle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const allowedDocTypes = [
  docTypes[IdxDocTypes["documentProposalType"]],
  docTypes[IdxDocTypes["documentPricingOfferingType"]],
  docTypes[IdxDocTypes["documentLegalType"]],
  docTypes[IdxDocTypes["documentFinancialType"]],
  docTypes[IdxDocTypes["documentAdministrativeType"]],
];
const ShowBidders = ({ address, owner, rfpIndex, rfpId, t, rfpDates }) => {
  const [idxShowFilesComp, setidxShowFilesComp] = useState(null); // index of open Files Compo
  const [dateAllowed, setDateAllowed] = useState(false); // flag to indicate the period is valid to upload documents according to RFP dates
  const { bidders, getBidders, companies, doneLookingBidders } = useBidders();
  const { setNewFiles, rfpfiles, updateRFPFilesArray, doneLookingFiles } =    useFilesRFP(rfpIndex);
  

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
  };

  const isDateAllowed = () => {
    const rightNow = convUnixEpoch(new Date());
    console.log(rfpDates[0] ,rightNow, rfpDates[1])
    return rfpDates[0] < rightNow && rightNow < rfpDates[1];
  };

  // Hooks ********************************************************************
  useEffect(() => {
    async function getBiddersInfo() {
      // obtain companies information from DataBase
      const result = await getBidders(rfpIndex);
      if (!result.status) {
        errToasterBox(result.message);
      } // trigger document metadata search on useFilesRFP
    }
    getBiddersInfo();
  }, []);

/** Hooks ********************************************************************** */
useEffect(()=>{
  async function getFilesData() {
    if (bidders) {
    const result = await updateRFPFilesArray()
    if (!result.status) errToasterBox(result.message)}
  }
  getFilesData()
},[bidders, updateRFPFilesArray])

  const CellTable = ({ field, highhLigth }) => (
    <td className={`w-1/4 p-2  font-khula ${highhLigth ? 'text-blue-800':'text-stone-800'}`}>
            {field}
    </td>
  );

  const toggleUploadComponent = (companyId) => {
    setidxShowFilesComp(companyId);
  };

  const ComponentLauncher = () => {
    if (!doneLookingBidders)
      return (
        <div className="mt-24 mb-4">
          <Spinner />
        </div>
      );
    else return <ShowBidersComponent />;
  };

  const UploadComponent = ({ company }) => {
    if (address.toLowerCase() === company?.address.toLowerCase())
      // if (isDateAllowed())
        return (
          <tr id={`uploadfiles`} key={`uploadfiles`}>
            <td colSpan={4}>
              <UploadRFPForm
                t={t}
                setNewFiles={setNewFiles}
                rfpId={rfpId}
                rfpIndex={rfpIndex}
                allowedDocTypes={allowedDocTypes}
                owner={owner}
                isInTime={isDateAllowed()}
              />
            </td>
          </tr>
        );
    //   else
    //     return (
    //       <tr key="out_of_period" className="border border-orange-400  font-khula font-bold text-stone-700 h-full
    //       w-fullshadow-lg">
    //         <td colSpan={4} className="p-8  ">
    //           <div className="flex justify-center ">
    //             <p className="py-2 px-4  border border-orange-200  text-khula text-stone-700 font-light text-lg rounded-md shadow-md">
    //               🚫 &nbsp; {t("loading_out_of_period")}
    //             </p>
    //           </div>
    //         </td>
    //       </tr>
    //     );
    // else return null;
  };

  const ShowBidersComponent = () => (
    <div className="m-2">
      {console.log("isDateAllowed()", isDateAllowed())}
      <table className="w-full text-left">
        <tbody key="bodyoftable">
          {companies?.length > 0 ? (
            companies.map((company) => (
              <>
                <tr
                  id={company._id}
                  key={nanoid()}
                  className={`${
                    company.companyId !== idxShowFilesComp
                      ? "border-b-2 border-orange-400"
                      : "text-lg font-bold"
                  }`}
                >
                  <CellTable field={company.companyId} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <CellTable field={company.companyname} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <CellTable field={company.country} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <td className="w-1/4 p-2 text-lg font-khula text-gray-700 text-right pr-4 ">
                    {idxShowFilesComp === company.companyId ? (
                      <Image
                        className="cursor-pointer "
                        onClick={() => toggleUploadComponent(null)}
                        alt="-"
                        src={"/dash.svg"}
                        width={22}
                        height={22}
                      ></Image>
                    ) : (
                      <Image
                        className="cursor-pointer"
                        onClick={() => toggleUploadComponent(company.companyId)}
                        alt="V"
                        src={"/chevrondown2.svg"}
                        width={22}
                        height={22}
                      ></Image>
                    )}
                  </td>
                </tr>
                {idxShowFilesComp === company.companyId && (
                  <>
                    {address.toLowerCase() === company?.address.toLowerCase() && (
                      <UploadComponent company={company} />
                    )}
                    <tr id={`downloadfiles`} key={`downloadfiles`} className="">
                      <td colSpan={4} className="p-2 ">
                        <div>
                          <DownloadFileForm
                            rfpfiles={rfpfiles}
                            t={t}
                            allowedDocTypes={allowedDocTypes}
                            owner={company.address}
                            doneLookingFiles={doneLookingFiles}
                          />
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))
          ) : (
            <tr id={`nobidders`} key="nobidders">
              <td className="text-center ">
                <p className="mt-8 font-khula text-xl">{t("no_bidders")}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <ComponentLauncher />
    </>
  );
};
export default ShowBidders;
