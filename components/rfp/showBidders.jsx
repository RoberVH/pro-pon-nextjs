/**
 * ShowBidders
 *  Show all current bidders and uploaded documents and (dates of uploading?)
 *  Show File picker component in current bidder if its a participant and is current account logged
 *  The payment for the uploading to arweave is from propon server account and if its invitation contest
 *  will be paid by RFP owner. If Open, then when registering the participant will pay for it
 */

import { useEffect, useState, Fragment } from "react";
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
import { parseWeb3Error } from '../../utils/parseWeb3Error'

const allowedDocTypes = [
  docTypes[IdxDocTypes["documentProposalType"]],
  docTypes[IdxDocTypes["documentPricingOfferingType"]],
  docTypes[IdxDocTypes["documentLegalType"]],
  docTypes[IdxDocTypes["documentFinancialType"]],
  docTypes[IdxDocTypes["documentAdministrativeType"]],
];
const ShowBidders = ({ 
    address, 
    owner, 
    rfpIndex, 
    t, 
    rfpDates,
    setNoticeOff
  }) => {
  const [idxShowFilesComp, setidxShowFilesComp] = useState(null); // index of open Files Compo
  //const [dateAllowed, setDateAllowed] = useState(false); // flag to indicate the period is valid to upload documents according to RFP dates
  const { bidders, getBidders, companies, doneLookingBidders } = useBidders();
  const { setNewFiles, rfpfiles, updateRFPFilesArray, doneLookingFiles } =    useFilesRFP(rfpIndex);
  

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, {
      //toastId: id,
      ...toastStyle,
    });
  };

  //isDateAllowed
  // for Request Documents, the period for Bidder  to upload documents is from beginning to end of receiving date
  // In a future version when Issuer could be able to load RFPs follow up contracts this function should be modified or not used
  const isDateAllowed = () => {
    const rightNow = convUnixEpoch(new Date());
    return rfpDates[0] < rightNow && rightNow < rfpDates[1];
  };

  // Hooks ********************************************************************
  useEffect(() => {
    async function getBiddersInfo() {
      // obtain companies information from DataBase
      const result = await getBidders(rfpIndex);
      if (!result.status) {
        const msgError= parseWeb3Error(t,result)
        errToasterBox(msgError);
      } // trigger document metadata search on useFilesRFP
    }
    getBiddersInfo();
  }, []);

/** Hooks ********************************************************************** */
useEffect(()=>{
  async function getFilesData() {
    if (bidders) {
    const result = await updateRFPFilesArray()
    if (!result.status) {
      // Error!, but result.message could be a string message or an object error to be parsed
      let msgError;
      if (typeof result.message!=='string'){
           msgError = parseWeb3Error(t,result.message)
          } else  msgError=t(result.message, {ns:"gralerrors"})
      errToasterBox(msgError)
    }
    
    }
  }
  getFilesData()
},[bidders, updateRFPFilesArray])

  const CellTable = ({ field, highhLigth, w }) => (
    <td className={`${w} p-2  font-khula ${highhLigth ? 'text-orange-700 font-bold':'text-stone-800'}`}>
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
                rfpIndex={rfpIndex}
                allowedDocTypes={allowedDocTypes}
                owner={owner}
                isInTime={isDateAllowed()}
                setNoticeOff={setNoticeOff}
              />
            </td>
          </tr>
        );
  };

  const ShowBidersComponent = () => (
    <div className="m-2">
      <table className="w-full text-left">
        <tbody key="bodyoftable">
          {companies?.length > 0 ? (
            companies.map((company) => (
              <Fragment key={nanoid()}>
                <tr
                  key={nanoid()}
                  className={`${
                    company.companyId !== idxShowFilesComp
                      ? "border-b-2 border-orange-400"
                      : "text-lg font-bold"
                  }`}>
                  <CellTable w={'w-1/6'} field={company.companyId} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <CellTable w={'w-3/6'} field={company.companyname} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <CellTable w={'w-1/6'} field={company.country} highhLigth={address.toLowerCase() === company?.address.toLowerCase()}/>
                  <td className="w-1/6 p-2 text-lg font-khula text-gray-700 text-right pr-4 ">
                    {idxShowFilesComp === company.companyId ? (
                      <Image
                        className="cursor-pointer "
                        onClick={() => toggleUploadComponent(null)}
                        alt="-"
                        src={"/dash.svg"}
                        width={22}
                        height={22}>
                        </Image>
                     ) : (
                        <Image
                          className="cursor-pointer"
                          onClick={() => toggleUploadComponent(company.companyId)}
                          alt="V"
                          src={"/chevrondown2.svg"}
                          width={22}
                          height={22}
                        >
                        </Image>
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
                            dateEnd={rfpDates[1]}
                            allowedDocTypes={allowedDocTypes}
                            owner={company.address}
                            doneLookingFiles={doneLookingFiles}
                            rfpIndex={rfpIndex}
                          />
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </Fragment>
            ))
          ) : (
            <tr id={`nobidders`} key="nobidders">
              <td className="text-center ">
                <div className="mt-4 w-2/3 min-w-full h-[9rem] min-h-full border-2 border-coal-500 
            flex shadow-lg p-4 justify-center items-center tracking-wide text-stone-500 uppercase"> 
                <p className="mt-8 font-khula text-xl">{t("no_bidders")}</p>
            </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ******************** Main JSX *****************
  return (
    <>
      <ComponentLauncher />
    </>
  );
};
export default ShowBidders;
