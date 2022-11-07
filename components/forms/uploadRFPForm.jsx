/**
 * UploadRFP
 *  Component to allow the owner of RFP to upload requesting RFP documents
 */
import { Fragment, useState, useEffect, useRef, useCallback, useContext } from 'react'
import Image from 'next/image'
import { UploadIcon } from '@heroicons/react/outline'
import { DocumentIcon} from '@heroicons/react/outline'
import { readFile } from '../../utils/filesOp'
import { MAX_FILES, MAX_CAPACITY_FILES } from '../../utils/constants'
import { proponContext } from '../../utils/pro-poncontext'
// toastify related imports
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../../styles/toastStyle'

const dropfilesFormat = {
  inactive:'text-orange-300',
  active: 'text-orange-600'
}

// const FileAnchor = ({iconName, fileName}) => {
//   return (
//   <div className="flex justify-center align-items">
//     <a
//         className=" text-blue-600 ml-3 flex"
//         href={'http:www.banamex.com'}
//         target="_blank"
//         rel="noreferrer">
//         <Image className="px-2" alt='excel file icon' src={iconName} height={30} width={30} />
//         <p>{fileName.slice(8)}...</p>
//     </a>  
//   </div>)
// }



function UploadRFPForm({t, setFiles}) {
  const [dropingFiles, setDroppintFiles] = useState(false)  // controls if user is dragging files over drop zone
  const [candidateFiles, setCandidateFiles] = useState([])  // state var to check if user files are ok, if ok set 
                                                            //callback setFiles for processing at parent control
                                                            
  const errToasterBox = (msj) => {toast.error(msj, toastStyle) }
  const { companyData, address } = useContext(proponContext)
  const inputRef = useRef(null);

  useEffect(()=>{
    const getRFPfromContract = async () => {
      if (address) check
    }


  },[])


 const checkFileLimits = useCallback(() => {
  if (candidateFiles.length > 0) {
    // process upload candidate files
    // Only MAX_FILES having less o equal MAX_CAPACITY_FILES bytes
    if (candidateFiles.length > MAX_FILES) {
      errToasterBox(t('maxfileserror'))
      return
    }
    let maxbytes=0
    Array.from(candidateFiles).forEach(file => {
      maxbytes+=file.size
    })
    if (maxbytes > MAX_CAPACITY_FILES){
      errToasterBox(t('maxsizeerror'))
      return
    }
    // all ok, setFiles to candidateFiles
    setFiles(candidateFiles)
  }}, [candidateFiles])



useEffect(()=>{
    checkFileLimits()
}, [candidateFiles, checkFileLimits])

  const handleChooseFile = (e) => {
    //const files2upload=Array.prototype.slice.call(e.target.files) // hacer un 'casi' arreglo en arreglo
    //console.log('files2upload',e.target.files)
    setCandidateFiles(e.target.files)
    console.log('handleChooseFile', e.target.files)
    }

  const handleDrop =  (e) => {
    e.preventDefault()
    setDroppintFiles(false)
    const files = [...e.dataTransfer.files];
    setCandidateFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDroppintFiles(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    setDroppintFiles(false)
  }

  const handleFileChange= (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files) 
    setCandidateFiles(chosenFiles)
    console.log('chosenFiles', chosenFiles)
  }

  return (
    <div className="my-8 mx-auto w-5/6 font-khula bg-white leading-8 border-2 border-orange-200 shadow-md">
      {console.log('candidateFiles',candidateFiles)}
     { Boolean(candidateFiles.length) ? (
      <div className="pl-2 py-1 px-4 bg-blue-200">
        hola mundo
      </div>)
      : 
      ( <Fragment>
          <div className="flex  pl-2 py-1 px-4">
            <Image alt="Proposal" src="/surveys-icon.svg" height={17} width={17} 
              className="text-orange-400 mt-1 ml-2" />  
            <p className="ml-4 mt-1 text-md text-stone-900">{t('rfpdocuments')}</p>
          </div>
          <div className="mx-8 py-1">
            <p> {t('uploadrequestdocuments')} </p>
            <div id="upload-tools" className="flex flex-col
                items-center justify-center ">
              <div className= {`${dropingFiles ? 'outline outline-4':'outline-2'} h-[12em] w-3/4 my-4 h-24  outline outline-dashed  
                                outline-orange-300 text-sm  text-orange-500 rounded-sm  flex flex-col items-center 
                                justify-evenly`}
                  onDrop={e => handleDrop(e)}
                  onDragOver={e => handleDragOver(e)}
                  onDragLeave={e => handleDragLeave(e)}
                  >
                    <div>
                      <UploadIcon className={`h-8 w-8 ${dropingFiles ? dropfilesFormat.active : dropfilesFormat.inactive}`} />
                    </div>
                    <div>
                    <p className={`${dropingFiles ? dropfilesFormat.active : dropfilesFormat.inactive}`}>{t('dragfileshere')}</p>
                    </div>
              </div>
              <div className="m-4">
                    <input 
                      id="selectrfprequestdocs" 
                      ref={inputRef}
                      className="my-2 mx-auto w-5/6  text-sm  text-orange-500  file:mr-4 
                          file:py-2 file:px-4file:rounded-full file:border-0 file:text-sm file:font-semibold w-0 
                          file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          onChange={(e)=> handleFileChange(e)}
                          type="file" multiple/>
                  <button 
                  onClick={()=> inputRef.current.click()}
                  className=" text-center outline outline-1 outline-orange-500 rounded-md cursor-pointer
                  outline-offset-2 p-1 hover:bg-orange-100 text-coal-300" htmlFor="rfprequestdocs">
                    {t('orselectfiles')}
                  </button>

              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default UploadRFPForm