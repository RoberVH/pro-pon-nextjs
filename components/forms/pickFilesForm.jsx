/**
 * pickFilesForm.jsx
 *      Form that displays a droppable area and a file picker for users to choose upload files
 *      it validates limits in quantity or total size of files aren't surpassed 
 *      set error flag if violation occurs or set files variable state with selected files objects
 */

import { Fragment, useState, useEffect, useRef, useCallback } from 'react'
import Image from "next/image";
import { MAX_FILES, MAX_CAPACITY_FILES } from "../../utils/constants"
import { UploadIcon } from "@heroicons/react/outline";
import { calculateFilesSize } from "../../utils/calculateFilesSize"

const dropfilesFormat = {
  inactive: "text-orange-300",
  active: "text-orange-600",
};

const PickFilesForm = ({t, setPickedFiles, errToasterBox, setTotalSize}) => {
  const [droppingFiles, setDroppingFiles] = useState(false);
  const [candidateFiles, setCandidateFiles] = useState([])

  const inputRef = useRef(null);

  useEffect(() => {
    checkFileLimits(candidateFiles);
  }, [candidateFiles, checkFileLimits]);


  // Functions to check and upload  files ****************************************************
  const checkFileLimits = useCallback((files) => {
    if (files.length > 0) {
      // process upload candidate files
      // Only MAX_FILES having less o equal MAX_CAPACITY_FILES bytes
      if (files.length > MAX_FILES) {
        errToasterBox(t("maxfileserror"));
        return;
      }
      const totalFilesSize = calculateFilesSize(files)
      if (totalFilesSize > MAX_CAPACITY_FILES) {
        errToasterBox(t("maxsizeerror"));
        return;
      }
      // all ok, pass back selected Files on parent state var funtion
      setPickedFiles(files)
    }
    setTotalSize(totalFilesSize)
  }, [t, setPickedFiles, errToasterBox, setTotalSize]);

  // Handlers for dropping & manually selecting files ****************************************************
  const handleDrop = (e) => {
    e.preventDefault();
    setDroppingFiles(false);
    const files = [...e.dataTransfer.files];
    setCandidateFiles(files);
    //  for  (const i=0; i < e.dataTransfer.files.length; i++)
    //  console.log('handleDrop file[',i,']', e.dataTransfer.files[i])
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
    setCandidateFiles(chosenFiles);
  };


    return (
        <Fragment>
          <div className="flex  pl-2 py-1 px-4">
            <Image
              alt="Proposal"
              src="/surveys-icon.svg"
              height={17}
              width={17}
              className="text-orange-400 mt-1 ml-2"
            />
            <p className="ml-4 mt-1 text-md text-stone-900">
              {t("rfpdocuments")}
            </p>
          </div>
          <div className="mx-8 py-1">
            <p> {t("uploadrequestdocuments")} </p>
            <div
              id="upload-tools"
              className="flex flex-col
                items-center justify-center "
            >
              <div
                className={`${
                  droppingFiles ? "outline outline-4" : "outline-2"
                } h-[12em] w-3/4 my-4 h-24  outline outline-dashed  
                                outline-orange-300 text-sm  text-orange-500 rounded-sm  flex flex-col items-center 
                                justify-evenly`}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
              >
                <div>
                  <UploadIcon
                    className={`h-8 w-8 ${
                      droppingFiles
                        ? dropfilesFormat.active
                        : dropfilesFormat.inactive
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`${
                      droppingFiles
                        ? dropfilesFormat.active
                        : dropfilesFormat.inactive
                    }`}
                  >
                    {t("dragfileshere")}
                  </p>
                </div>
              </div>
              <div className="m-4">
                <input
                  id="selectrfprequestdocs"
                  ref={inputRef}
                  className="my-2 mx-auto w-5/6  text-sm  text-orange-500  file:mr-4 
                          file:py-2 file:px-4file:rounded-full file:border-0 file:text-sm file:font-semibold w-0 
                          file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  onChange={(e) => handleFileChange(e)}
                  type="file"
                  multiple
                />
                <button
                  onClick={() => inputRef.current.click()}
                  className=" text-center outline outline-1 outline-orange-500 rounded-md cursor-pointer
                  outline-offset-2 p-1 hover:bg-orange-100 text-coal-300"
                  htmlFor="rfprequestdocs"
                >
                  {t("orselectfiles")}
                </button>
              </div>
            </div>
          </div>
        </Fragment>
        )
    }
export default PickFilesForm;