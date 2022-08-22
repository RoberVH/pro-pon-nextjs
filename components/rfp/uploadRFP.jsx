import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { UploadIcon } from '@heroicons/react/outline'
import { DocumentIcon} from '@heroicons/react/outline'
import { readFile } from '../../utils/filesOp'
import { MAX_FILES, MAX_CAPACITY_FILES } from '../../utils/constants'
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


// const DonwloadFileForm = ({files}) => 
//   <ul>
//     { files.map((file,indx) => 
//       <li key={indx}>{file}</li>
//       )
//     }
//   </ul>

function UploadRFP({t, setFiles}) {
  const [dropingFiles, setDroppintFiles] = useState(false)  // controls if user is dragging files over drop zone
  const [candidateFiles, setCandidateFiles] = useState([])  // state var to check if user files are ok, if ok set 
                                                            //callback setFiles for processing at parent control
  

  const errToasterBox = (msj) => {toast.error(msj, toastStyle) }


 const uploadFiles = useCallback(() => {
   console.log('candidateFiles', candidateFiles)
  if (candidateFiles.length > 0) {
    // process upload candidate files
    // Only MAX_FILES having less o equal MAX_CAPACITY_FILES bytes
    if (candidateFiles.length > MAX_FILES) {
      errToasterBox(t('maxfileserror'))
      return
    }
    let maxbytes=0
    Array.from(candidateFiles).forEach(file => {
      console.log('Xfile', file)
      maxbytes+=file.size
    })
    console.log('maxbytes',maxbytes)
    if (maxbytes > MAX_CAPACITY_FILES){
      errToasterBox(t('maxsizeerror'))
      return
    }
    // all ok, setFiles to candidateFiles
    setFiles(candidateFiles)
  }}, [candidateFiles])

useEffect(()=>{
    uploadFiles()
}, [candidateFiles, uploadFiles])

  const handleChooseFile = (e) => {
    //const files2upload=Array.prototype.slice.call(e.target.files) // hacer un 'casi' arreglo en arrego
    //console.log('files2upload',e.target.files)
    setCandidateFiles(e.target.files)
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

  return (
    <div className="w-2/6 font-khula mx-8  bg-white leading-8 shadow-md">
      <div className="flex pl-2 py-1 px-4">
        <Image alt="Proposal" src="/surveys-icon.svg" height={17} width={17} 
          className="text-orange-400 mt-1 ml-2" />  
        <p className="ml-4 mt-1 text-md text-stone-900">{t('rfpdocuments')}</p>
      </div>
      <div className="mx-8 py-1">
        {/* <p> {t('uploadrequestdocuments')} Upload your RFP documents</p> */}
        <div id="upload-tools" className="flex flex-col
            items-center justify-center ">
          <div className= {`${dropingFiles ? 'outline outline-4':'outline-2'} w-3/4 my-4 h-24  outline outline-dashed  outline-orange-300 text-sm 
              text-orange-500 rounded-sm  flex flex-col items-center justify-evenly`}
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
          <div>
              <label htmlFor="rfprequestdocs">{t('orselectfiles')}o Selecciona archivo(s):</label>
              <form onSubmit={handleChooseFile}>
                <input id="rfprequestdocs" className="mt-2 mx-auto w-5/6  text-sm  text-orange-500  file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:text-sm file:font-semibold
                        file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        onChange={(e)=>setCandidateFiles(e.target.files)}
                        type="file" multiple/>
                </form>
          </div>
        </div>
        {/* <div className="my-8 my-4 mx-4 overflow-x-auto h-1/6  bg-stone-200 outline outline-1 
            outline-stone-500">
          { rfpfiles.length ?
             <DonwloadFileForm files={rfpfiles}/>
            : <div className= "p-2 center-text">
                <p className= "text-center"> {t('nofiles')} NO FILES </p>
              </div>
          }
        </div> */}
      </div>
    </div>
  )
}

export default UploadRFP