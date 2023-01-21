import React from 'react'
import { ExclamationCircleIcon } from "@heroicons/react/solid"
//import { ExclamationCircleIcon } from "@heroicons/react/outline"
import { CheckCircleIcon } from "@heroicons/react/outline"
import Image from "next/image"



import  ProgressBr  from "../layouts/progressBar"

const  DisplayProgressUpload=({t, files,  uploadingSet}) => {
  const checkProperty = (index,property) => {
    return (
      Boolean (uploadingSet[index]) &&
      Boolean (uploadingSet[index][property])
    )
  }

  const DisplayStatus = ({index}) => {
    if (!Boolean(uploadingSet[index]) || typeof uploadingSet[index].status ==='undefined')  return null
    switch (uploadingSet[index].status)  {
      case 'pending':
        return (
          <div className="pl-2 pt-1"><Image alt="spinningarrow" src="/spinningarrow.svg" height={18} width={18}
            className="animate-spin"/> 
          </div>
        )
      case 'error':
        return (
          <div className="group relative inline-block flex align-center justify-center">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600 "/>
            {/* <button className="tooltip-span-right mt-2"> */}
              <span className="tooltip-span-error-upload">
                            {uploadingSet[index].error}
              </span>
            {/* </button> */}
          </div>
        )
      case 'success':
        return (
          <CheckCircleIcon className="h-5 w-5 text-green-600  ml-2"/> 
          )
      default:
          console.log('Couldnt switch uploadingSet[index].status', uploadingSet[index].status)
          return null
    }
  }

  return (
    <div> 
      <table className="table-fixed w-full">
        <thead></thead>
        <tbody className="">
        {
          files.map((file,indx) => 
            <tr key={file.name} className="border-2 border-orange-200 pl-2 text-stone-600 w-[35%]">
                <td className="pl-1 truncate">
                  <strong>{file.name}</strong>
                </td>
                <td className="border-2 border-orange-200 p-1 w-[40%]">
                    { checkProperty(indx,'progress') &&
                      <ProgressBr progress={uploadingSet[indx].progress} />
                    }
                </td>
                <td className="border-2 border-orange-200 w-[20%] truncate">
                    <label  className="pl-1 font-bold text-stone-600"> 
                    { checkProperty(indx, 'hash') ? 
                        `Hash: ${uploadingSet[indx].hash.slice(0, 11)}...${uploadingSet[indx].hash.slice(-11)}` 
                      : null
                    }
                    </label>
                </td>
                <td className="w-[3%]">
                 <DisplayStatus index={indx}/>
                </td>
            </tr>)
        }
      </tbody>
      </table>
    </div>
  )

}
export default DisplayProgressUpload
