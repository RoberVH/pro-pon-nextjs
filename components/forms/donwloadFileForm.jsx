import { useState, useEffect } from 'react'
import { DownloadIcon } from '@heroicons/react/outline'



const DonwloadFileForm = ({ rfpfiles, t, docType, owner }) => {
  const [downloadableFiles, setDownloadableFiles] = useState([])
  console.log('owner, docType', owner, docType)
  

  useEffect(()=>{
    const downFiles = rfpfiles.filter(doc =>
         doc.owner.toLowerCase()=== owner.toLowerCase() && doc.docType.toNumber()===docType)
    setDownloadableFiles(rfpfiles.filter(doc =>
      doc.owner.toLowerCase()=== owner.toLowerCase() && doc.docType.toNumber()===docType))
  },[])

  return (
  <div className="m-auto py-2 max-w-[90%] ">
    <div className="flex">
      <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
      <p className="mt-2 pl-2">{t('dowloadrequestfiles')}</p>
    </div>
    {downloadableFiles.length ?
    <div  className="h-[44rem] overflow-y-scroll">
      <table 
      className="table-fixed border-collapse font-khula font-bold text-stone-700 h-full
                   w-full mb-8 border-4  border-stone-300 ">
        <thead className="">
          <tr className="  bg-orange-100  text-left text-xl text-stone-900 font-extrabold">
            <th className="p-4 w-1/3 border-2 border-stone-300">
                <string>{t('document_name')}</string>
                </th>
            <th className="p-4 border-2  border-stone-300 "><string>{t('document_hash')}</string></th>
          </tr>
        </thead>
        <tbody className="">
          {downloadableFiles.map(file => (
            <tr key={file.idx} className="even:bg-slate-200 odd:bg-slate-100 ">
              <td className="border-2 border-coal-600 flex p-2 truncate">
                <div className="flex">
                  <a
                    key={file.indx}
                    className=" text-blue-600 ml-3 flex"
                    href={`https://arweave.net/${file.idx}`}
                    target="_blank"
                    rel="noreferrer"
                    >
                    📥️    
                </a> 
                 <p className="whitespace-pre">  {file.name}</p>
                </div>
              </td>
              <td className=" truncate  border-2 border-coal-600 p-2">{file.documentHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      :
      <div className="mt-2 flex items-center justify-center border shadow-lg h-40">
        <p className="whitespace-pre "> -  {t('nofiles')}  -</p>
      </div>
    }
  </div> 
)};
export default DonwloadFileForm