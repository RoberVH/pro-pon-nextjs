import { useState } from 'react'
import Image from 'next/image'
import { DownloadIcon } from '@heroicons/react/outline'
import { DocumentIcon} from '@heroicons/react/outline'


const DonwloadFileForm = () => {
  return (
    <div id="filedownloadform" className="my-4 mx-4 overflow-x-auto h-1/6 flex
    bg-stone-200 outline outline-1 outline-stone-500" >
  <a
      className=" text-blue-600 ml-3 flex"
      href={'http:www.banamex.com'}
      target="_blank"
      rel="noreferrer">
      <Image className="px-2" alt='excel file icon' src='/microsoft-excel-icon.svg' height={30} width={30} />
      <DocumentIcon className="m-4 h-8 w-8 text-orange-700" />
      <Image className="px-2" alt='pdf file icon' src='/pdf-icon.svg' height={30} width={30} />
      <DocumentIcon className="m-4 h-8 w-8 text-orange-700" />
      <Image alt='word file icon' src='/microsoft-word-icon.svg' height={30} width={30} />
      <DocumentIcon className="m-4 h-8 w-8 text-orange-700" />
      <Image alt='excel file icon' src='/microsoft-excel-icon.svg' height={30} width={30} />
    </a>
  
</div>
  )
}

function UploadRFP({t}) {
  const [dropingFiles, setDroppintFiles] = useState(false)
    const handleChooseFile = (e) => {
        

    }

  const handleDrop = (e) => {
    e.preventDefault()
    console.log('handleDrop')
    console.log('e:', e.dataTransfer)
    const files = [...e.dataTransfer.files];
    console.log('files', files.length)
    Array.from(e.target.files).forEach(file => {
            console.log('file',file)})
  }

  
  const handleDragOver = (e) => {
    e.preventDefault()
    console.log('handleDragOver')
    setDroppintFiles(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    console.log('handleDragLeave')
    setDroppintFiles(false)
  }


  return (
    <div className="w-2/6 font-khula mx-8  bg-white leading-8 shadow-md">
      <div className="flex pl-2 py-1 px-4">
        <Image alt="Proposal" src="/surveys-icon.svg" height={17} width={17} 
          className="text-orange-400 mt-1 ml-2" />  
        <p className="ml-4 mt-1 text-md text-stone-900">{t('rfpdocuments')}</p>
      </div>
      <div className="mx-8 py-4">
        <p> {t('uploaddocuments')} Upload your RFP documents</p>
        <div id="upload-tools" className="flex flex-col
            items-center justify-center ">
          <div className= {`${dropingFiles ? ("outline outline-4"):null} w-3/4 my-4 h-24  outline outline-dashed outline-2 outline-orange-300 text-sm 
              text-orange-500 rounded-sm  flex flex-col items-center justify-evenly`}
              onDrop={e => handleDrop(e)}
              onDragOver={e => handleDragOver(e)}
              onDragLeave={e => handleDragLeave(e)}
              >
                  <div>
                  <DownloadIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                <p className="text-orange-600">{t('dragfileshere')}</p>
                </div>
          </div>
          <div>
            <p>
              <label htmlFor="rfprequestdocs">{t('orselectfiles')}o Selecciona archivo(s):</label>
              <input id="rfprequestdocs" className="mt-2 mx-auto w-5/6  text-sm  text-orange-500  file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:text-sm file:font-semibold
                        file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        onClick={(e) => handleChooseFile(e)}
                        type="file" multiple/>
            </p>
          </div>
        </div>
        <div>
        </div>
        <div className="my-8">
          <DonwloadFileForm />
        </div>
      </div>
    </div>
  )
}

export default UploadRFP