import { useState, useEffect } from "react";
import { DownloadIcon } from "@heroicons/react/outline";
import { docTypes } from '../.././utils/constants'
/**
@param {Object} props - The properties for the DownloadFileForm component.
@param {Array} rfpfiles - An array of RFP files that can be downloaded. this comprises all files
        associated to RFP, Request, response, Q&A etc files
@param {Function} t - The translation function for internationalization.
@param {string} docType - The record type of document showed to be downloaded.
@param {String} owner - Address of the user account logged in if.
@returns {JSX.Element} - The rendered DownloadFileForm component.
*/
const DownloadFileForm = ({ rfpfiles, t, allowedDocTypes, owner }) => {
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [timerWarning, setTimerWarning] = useState(false);

  // copy the passed text ti clickboard and briefly turn on flag to show message copied to clipboard
  const copyclibboard = (text) => {
    navigator.clipboard.writeText(text);
    setTimerWarning(true);
    setTimeout(() => setTimerWarning(false), 600);
  };

  console.log('Download component rfpfiles',rfpfiles)
  console.log('Passed docType', allowedDocTypes)
  useEffect(() => {
    if (rfpfiles)
      setDownloadableFiles(
        rfpfiles.filter(
          (doc) =>
            doc.owner.toLowerCase() === owner.toLowerCase() && allowedDocTypes.some(obj => obj.id === doc.docType.toString())
            //doc.docType.toNumber() === docType.id // is included on
        )
      );
  }, [rfpfiles, allowedDocTypes, owner]);

  return (
    <div className="m-auto py-2 max-w-[90%] ">
      <div className="flex">
        <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
        <p className="mt-2 pl-2 font-khula">{t("dowloadrequestfiles")}</p>
      </div>
      {downloadableFiles.length ? (
        <div className=" max-h-[44rem] overflow-y-auto ">
          {timerWarning && (
            <p className="absolute  left-[50%] text-center w-[10em] bg-orange-500 text-white">
              Copied to clipboard
            </p>
          )}
          <table
            className="table-fixed border-collapse font-khula font-bold text-stone-700 h-full
                    w-full mb-8 border-2 border-stone-300"
          >
            <thead className="">
              <tr className="font-khula text-lg  bg-orange-100  text-left text-stone-600 ">
                <th className="w-5/12 px-4 py-2 w-1/3 border-2 border-stone-300 text-base">
                  <strong>{t("document_name")}</strong>
                </th>
                <th className="w-5/12 px-4 py-2 border-l-4 border-coal-400 text-base ">
                  <strong>{t("document_hash")}</strong>
                </th>
                <th className="w-2/12 px-4 py-2 border-l-4 border-coal-400 text-base ">
                  <strong>{t("doc_type")}</strong>
                </th>
              </tr>
            </thead>
            <tbody className="">
              {downloadableFiles.map((file) => (
                <tr
                key={file.idx}
                className="even:bg-slate-200 odd:bg-slate-300 "
                >
                  {console.log('file por mostrar:', file)}
                  <td className="odd:border-2 odd:border-coal-900 flex p-2 truncate">
                    <div className="flex">
                      <a
                        key={file.indx}
                        className="ml-3 flex"
                        href={`https://arweave.net/${file.idx}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📥️
                      </a>
                      <p className="whitespace-pre text-sm"> {file.name}</p>
                    </div>
                  </td>
                  <td
                    onClick={() => copyclibboard(file.documentHash)}
                    className=" truncate  border-2 p-2 text-sm even:border-2 even:border-slate-300 cursor-pointer"
                  >
                    {file.documentHash}
                  </td>
                  <td
                    className=" truncate  border-2 p-2 text-sm even:border-2 even:border-slate-300 cursor-pointer"
                  >
                    {console.log('fil',file)}
                    {t(docTypes[file.docType.toNumber()].desc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-center border shadow-lg h-40">
          <p className="whitespace-pre "> - {t("nofiles")} -</p>
        </div>
      )}
    </div>
  );
};
export default DownloadFileForm;
