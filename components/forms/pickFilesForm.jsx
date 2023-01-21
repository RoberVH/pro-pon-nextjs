/**
 * pickFilesForm.jsx
 *      Form that displays a droppable area and a file picker for users to choose upload files
 *      when user drop or select files, these are set on candidateFiles which triggers useEffect 
 *      that call size limits with function checklimits, it validates limits in quantity or total size of files aren't surpassed 
 *
 *      if  limits are ok, files are set in local filesforDoctyping state var, that shows html of  Doctype set form table to allow user
 *      set docTypes  for them
 *      On that Doctype set form,  user can accept or cancel operation
 *      if Accept, docTypes are added and set with prop function setPickedFiles to trigger action on parent component 
 */

import { Fragment, useState, useEffect, useRef, useCallback } from 'react'
import Image from "next/image";
import { MAX_FILES, MAX_CAPACITY_FILES } from "../../utils/constants"
import { UploadIcon } from "@heroicons/react/outline";
import { calculateFilesSize } from "../../utils/calculateFilesSize"
import { docTypes, IdxDocTypes } from '../../utils/constants'


const dropfilesFormat = {
  inactive: "text-orange-300",
  active: "text-orange-600",
};

const PickFilesForm = ({t, setPickedFiles, errToasterBox, setTotalSize, allowedDocTypes}) => {
  const [droppingFiles, setDroppingFiles] = useState(false);
  const [candidateFiles, setCandidateFiles] = useState([])
  const [filesforDoctyping, setFilesforDoctyping] = useState([])
  

  const inputRef = useRef(null);

  // Inner Components ******************************************************************************************
  // 0: {id: 0,type:'documentRequestType', desc:"request_doc", public:true},
  const  TitleUploader= () => 
    <div className="flex  pl-2 py-1 px-4">
      <Image className="text-orange-400 mt-1 ml-2" alt="Proposal" src="/surveys-icon.svg" height={17} width={17} />
        <p className="ml-4 mt-1 text-md text-stone-900">
        {t("rfpdocuments")}
      </p>
  </div>
    
    const SelectDocTypes= ({fileName}) => 
         <select 
            className=" block w-full px-3 py-1.5 text-sm font-khula bg-gray-100 bg-clip-padding 
                        bg-no-repeat border border-solid border-gray-300 outline-none rounded transition ease-in-out
                        border-0 border-grey-light  focus:bg-blue-100 
                        text-black  font-khula"
            onChange={(e)=>handleChangeDocType(e,fileName)}
            value={filesforDoctyping.filter(file=> file.name===fileName).docType}
            defaultValue={allowedDocTypes[2].type}>
            { allowedDocTypes.map (docType =>
              <option key= {docType.id} value={docType.id}>{t(docType.desc)}
              </option> 
            )}
        </select>
    


  const DroppingFilesArea= () => 
    <div className={`${droppingFiles ? "outline outline-4" : "outline-2"} h-[12em] w-3/4 my-4 h-40  outline items-center 
                                  outline-dashed  outline-orange-300 text-sm  text-orange-500 rounded-sm  flex flex-col justify-evenly`}
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}>
      <div>
        <UploadIcon
          className={`h-8 w-8 ${droppingFiles
              ? dropfilesFormat.active
              : dropfilesFormat.inactive}`} />
      </div>
      <div>
        <p
          className={`${droppingFiles
              ? dropfilesFormat.active
              : dropfilesFormat.inactive}`}
        >
          {t("dragfileshere")}
        </p>
      </div>
    </div>
  
  const SelectFilesCompo = () => 
  <div className="m-4">
    <input
      id="selectrfprequestdocs"
      ref={inputRef}
      className="font-khula mx-auto w-5/6  text-sm  text-orange-500 file:mr-4 
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

  // UseEffect Hooks                ******************************************************************************************
  useEffect(() => {
    checkFileLimits(filesforDoctyping);
  }, [filesforDoctyping, checkFileLimits]);
//}, [candidateFiles, checkFileLimits]);



  // Functions to check totla size against App limit  *****************************************************************************************
  // checkFileLimits is called from useEffect when filesforDoctyping is set
  // If everthing fine, add the default docktype to filesforDoctyping and set candidateFiles for further processing
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
      /* this code pass it 
      // all ok, pass back selected Files on parent state var funtion
      setPickedFiles(files)*/

      // add default doctypes to  candidateFiles
      console.log('to begin with files:',files)
      //  const nuevoset = files.map(file =>  { return {...file, docType:allowedDocTypes[0].id} })
       
      //  console.log('agregado:', nuevoset)
      //setFilesforDoctyping(prevFile => prevFile.map(file => ({...file, docType: allowedDocTypes[0].id})))

    }
    setTotalSize(totalFilesSize)
  }, [t, setPickedFiles, errToasterBox, setTotalSize]);

  // Handlers for dropping & manually selecting files and handle changes *********************************************************************
  const handleDrop = (e) => {
    e.preventDefault();
    setDroppingFiles(false);
    const files = [...e.dataTransfer.files];
    //setFilesforDoctyping(files);
    console.log('files', files)
    setFilesforDoctyping(files.map(file => {
      return { 
        name: file.name,
        size: file.size,
        type: file.type,
        docType: allowedDocTypes[0].id
      };
    }))
    //setFilesforDoctyping(newFiles);
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
    //setFilesforDoctyping(chosenFiles);
    console.log('chosenFiles', chosenFiles)
    setFilesforDoctyping(chosenFiles.map(file => {
      return { 
        name: file.name,
        size: file.size,
        type: file.type,
        docType: allowedDocTypes[0].id
      };
    }))
  };

  const handleChangeDocType = (event,fileName) => {
    console.log('event.target',event.target)
      const selectedValue = event.target.value;
      console.log('selectedValue',selectedValue)
      console.log('fileName',fileName)
      setFilesforDoctyping(prevFiles => {
          const updatedFiles = prevFiles.map(file => {
            if (file.name === fileName) {
              return { ...file, docType: selectedValue };
            }
            return file;
          });
          return updatedFiles;
      })

  };

  // everything went fine, user select files / selected docType for all.
  // and has clicked on ok to upload button, proced to triger actions seting the candidatefiles 
  const handleAcceptUploadFiles = (files) => {
    // all ok, pass back selected Files on parent state var funtion
    setPickedFiles(files)
  }
// PickFilesForm returned JSX: ----------------------------------
    return (
        <Fragment>
          <TitleUploader />
          { !Boolean(filesforDoctyping.length) ?
          <div id="displayFilePicker">
            <p className="mx-8 py-1"> {t("uploadrequestdocuments")} </p>
            <div id="upload-tools" className="flex flex-col items-center justify-center">
              <DroppingFilesArea />
              <SelectFilesCompo />
            </div>
          </div>
          :
          <div id="displayTableDocTypes">
            {/* {console.log(filesforDoctyping)} */}
            <table className="m-4 table-fixed w-[80%] border-2 border-orange-200">
              <tbody className="p-2">
              { filesforDoctyping.map((file,idx) => 
                <tr key={file.name} className="font-khula">
                  <td className="w-[45%] text-left pl-2"> {file.name} </td>
                  <td className="w-[55%] text-left"> 
                    <SelectDocTypes fileName={file.name}/>
                  </td>
                </tr>
              )
              }
              </tbody>
            </table>
          </div>
          }
        </Fragment>
        )
    }


  export default PickFilesForm;