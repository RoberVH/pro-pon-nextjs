
import React from 'react'
import  ProgessBr  from '../layouts/progressBar'

 const  DisplayProgressUpload=({t, files, progressPrctge, hashSet}) => {
  return (
    <div> 
      <ul className="my-2">
        {
          files.map((file,indx) => 
            <li 
              className="mx-2  p-1" 
              key={file.name} >
                <div className="grid grid-cols-3  flex items-center">
                  <span className="border-2 border-orange-200 pl-2 truncate text-stone-600 ">
                    <strong>{file.name}</strong>
                  </span>
                  <span className="border-2 border-orange-200 p-1">
                    <ProgessBr progress={progressPrctge[indx]} />
                  </span>
                  <span className="border-2 border-orange-200 ">
                    <label  className="pl-2 font-bold text-stone-600"> 
                      {(Boolean(hashSet[indx]) && hashSet[indx].length > 15) ?
                        `Hash: ${hashSet[indx].slice(0, 15)}...${hashSet[indx].slice(-15)}` : ''
                      }
                    </label>
                  </span>
                </div>
                </li>)
         }
      </ul>
    </div>
  )

}
export default DisplayProgressUpload
