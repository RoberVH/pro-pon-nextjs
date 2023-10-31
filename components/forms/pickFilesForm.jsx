/**
 * pickFilesForm.jsx
 *      Form that displays a droppable area and a file picker for users to choose upload files
 *      when user drop or select files, these are set on candidateFiles which triggers useEffect
 *      that call size limits with function checklimits, it validates limits in quantity or total size of files aren't surpassed
 *
 *      if  limits are ok, files are set in local candidateFiles state var, that shows html of  Doctype set form table to allow user
 *      set docTypes  for them
 *      On that Doctype set form,  user can accept or cancel operation
 *      if Accept, docTypes are added and set with prop function setPickedFiles to trigger action on parent component
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { MAX_FILES, MAX_CAPACITY_FILES } from "../../utils/constants";
import { UploadIcon } from "@heroicons/react/outline";
import { calculateFilesSize } from "../../utils/calculateFilesSize";
//import { docTypes, IdxDocTypes } from '../../utils/constants'

const dropfilesFormat = {
  inactive: "text-orange-300",
  active: "text-orange-600",
};

const PickFilesForm = ({
  t,
  setPickedFiles,
  errToasterBox,
  setTotalSize,
  allowedDocTypes,
  isInTime,
}) => {
  const [droppingFiles, setDroppingFiles] = useState(false);
  const [candidateFiles, setCandidateFiles] = useState([]);
  const [localTotalSize, setLocalTotalSize] = useState(0);

  const inputRef = useRef(null);

  // Inner Components ******************************************************************************************
  const TitleUploader = () => (
    <div className="text-components flex  pl-2 py-1 px-4 ">
      <Image
        className="text-orange-400 mt-1 ml-2 "
        alt="Proposal"
        src="/surveys-icon.svg"
        height={17}
        width={17}
      />
      <p className="ml-4 mt-1 text-md text-stone-900">{t("rfpdocuments")}</p>
    </div>
  );

  const SelectDocTypes = ({ fileName }) => (
    <select
      className=" block w-full px-3 py-1.5 text-sm font-khula  bg-white bg-clip-padding 
                    bg-no-repeat border border-solid border-gray-300 outline-none rounded transition ease-in-out
                      border-grey-light hover:cursor-pointer  "
      onChange={(e) => handleChangeDocType(e, fileName)}
      value={candidateFiles.filter((file) => file.name === fileName)[0].docType}
    >
      {allowedDocTypes.map((docType) => (
        <option key={docType.id} value={docType.id} label={t(docType.desc)} />
      ))}
    </select>
  );

  const DroppingFilesArea = () => (
    <div
      className={`${
        droppingFiles ? "outline outline-4" : "outline-2"
      } h-[12em] w-3/4 my-4   items-center 
                                  outline-dashed  outline-orange-300 text-sm  text-orange-500 rounded-sm  flex flex-col justify-evenly`}
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      <div>
        <UploadIcon
          className={`h-8 w-8 ${
            droppingFiles ? dropfilesFormat.active : dropfilesFormat.inactive
          }`}
        />
      </div>
      <div>
        <p
          className={`${
            droppingFiles ? dropfilesFormat.active : dropfilesFormat.inactive
          }`}
        >
          {t("dragfileshere")}
        </p>
      </div>
    </div>
  );

  const SelectFilesCompo = () => (
    <div className="m-4">
      <input
        id="selectrfprequestdocs"
        ref={inputRef}
        className="font-khula mx-auto  text-sm  text-orange-500 file:mr-4 
                file:py-2 file:px-4file:rounded-full file:border-0 file:text-sm file:font-semibold w-0 
                file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        onChange={(e) => handleFileChange(e)}
        type="file"
        multiple
      />
      <button
        onClick={() => inputRef.current.click()}
        className="lg:text-xs xl:text-sm text-center outline outline-1 outline-orange-500 rounded-md cursor-pointer
      outline-offset-2 p-1 hover:bg-orange-100 text-coal-300"
        htmlFor="rfprequestdocs"
      >
        {t("orselectfiles")}
      </button>
    </div>
  );

  // UseEffect Hooks                ******************************************************************************************
  // checkFileLimits is called from useEffect when candidateFiles is set
  useEffect(() => {
    checkFileLimits(candidateFiles);
  }, [candidateFiles, checkFileLimits]);

  // Functions to check totla size against App limit  *****************************************************************************
  // if excedeed limits, clear candidateFiles and display error message
  // If everthing fine, add the default docktype to candidateFiles and set candidateFiles for further processing
  const checkFileLimits = useCallback(
    (files) => {
      const sizeLimit = parseFloat(MAX_CAPACITY_FILES.replace(/_/g, ""));
      if (files.length > 0) {
        // process upload candidate files
        // Only MAX_FILES having less o equal MAX_CAPACITY_FILES bytes
        if (files.length > MAX_FILES) {
          setCandidateFiles([]);
          errToasterBox(t("maxfileserror") + MAX_FILES);
          return;
        }
        const totalFilesSize = calculateFilesSize(files);

        if (totalFilesSize > sizeLimit) {
          setCandidateFiles([]);
          errToasterBox(
            t("maxsizeerror") + MAX_CAPACITY_FILES.replace(/_/g, ",") + " bytes"
          );
          return;
        }
      }
      setLocalTotalSize(totalFilesSize);
    },
    [t, errToasterBox]
  );

  // Handlers for dropping & manually selecting files and handle changes *********************************************************************
  const handleDrop = (e) => {
    e.preventDefault();
    setDroppingFiles(false);
    const files = [...e.dataTransfer.files];
    setCandidateFiles(
      files.map((file) => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          docType: allowedDocTypes[0].id, // as default set the first allowed type to document
          originalFile: file,
        };
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDroppingFiles(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDroppingFiles(false);
  };

  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setCandidateFiles(
      chosenFiles.map((file) => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          docType: allowedDocTypes[0].id, // as default set the first allowed type to document
          originalFile: file,
        };
      })
    );
  };

  const handleChangeDocType = (event, fileName) => {
    const selectedValue = event.target.value;
    setCandidateFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) => {
        if (file.name === fileName) {
          return { ...file, docType: selectedValue };
        }
        return file;
      });
      return updatedFiles;
    });
  };

  /* handleAcceptUploadFiles
   * Everything went fine, user select files / selected docType for all.
   * and has clicked on ok to upload button, proced to triger actions seting the candidatefiles
   */
  const handleAcceptUploadFiles = (files) => {
    // all ok, pass back selected Files on parent state var funtion,
    //but first update total file size
    setTotalSize(localTotalSize);
    setPickedFiles(candidateFiles);
  };

  /* handleCancelUploadFiles
   * USer repent and cancel present document batch, so go back to square zero
   * discard selected files
   */
  const handleCancelUploadFiles = (files) => {
    // all ok, pass back selected Files on parent state var funtion
    setCandidateFiles([]);
  };

  // PickFilesForm returned JSX: ******************************************************
  return (
    <div>
      <TitleUploader />
      {!isInTime ? (
        <div className="">
          <p className="mx-8 py-1"> {t("uploadrequestdocuments")} </p>
          <div className="flex justify-center">
            <p className="my-8 py-2 px-4 mx-auto  text-khula text-stone-700 font-bold text-lg ">
              🚫 &nbsp;{t("loading_out_of_period")}
            </p>
          </div>
        </div>
      ) : !Boolean(candidateFiles.length) ? (
        <div id="displayFilePicker">
          <div
            id="upload-tools"
            className="flex flex-col items-center justify-center"
          >
            <DroppingFilesArea />
            <SelectFilesCompo />
          </div>
        </div>
      ) : (
        <>
          <p className="text-components ml-8 font-khula">{t("select_doctype")}</p>
          <div
            id="displayTableDocTypes"
            className="border-0 border-gray-200 mb-2 flex justify-center"
          >
            <table className="m-4  table-fixed   w-[80%]">
              <tbody className="p-2">
                {candidateFiles.map((file, idx) => (
                  <tr key={file.name} className="font-khula">
                    <td className="w-[65%] text-left pl-2 border-2 border-gray-200 font-khula text-components truncate group ">
                      {file.name}
                      <span
                        className="absolute invisible group-hover:visible  px-4 py-2 rounded-md bg-gray-100 shadow-md font-xs font-semibold opacity-0 
                              group-hover:opacity-100 transition left-[35%] top-[50%]"
                      >
                        {file.name}
                      </span>
                    </td>
                    <td className="text-components w-[45%] text-left border-2 border-gray-200">
                      <SelectDocTypes fileName={file.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="m-6 flex justify-center">
            <button
              onClick={handleAcceptUploadFiles}
              className="bg-orange-400 font-xl font-bold font-khula  mr-10 px-4 py-2.5  
                      text-white leading-tight uppercase rounded shadow-md hover:bg-orange-700 active:hover:shadow-lg 
                      active:focus:bg-orange-700 focus:shadow-lg active:focus:outline-none active:focus:ring-0 active:bg-orange-800 
                      active:shadow-lg transition duration-150 ease-in-out disabled:bg-orange-400 text-sm"
            >
              {t("accept")}
            </button>
            <button onClick={handleCancelUploadFiles} className="secondary-btn">
              {t("cancelbutton")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PickFilesForm;
