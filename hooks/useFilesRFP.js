import { useState, useEffect, useCallback } from 'react'
import { getArweaveFilesMetadata } from '../web3/getArweaveFilesMetadata'
// import { getContractRFPbidders } from '../web3/getContractRFPbidders'

export const  useFilesRFP= (rfpidx) => {
    const [newfiles, setNewFiles] = useState(false); // flag to refresh RFP files loaded. Get them from contract
    const [rfpfiles, setRFPFiles] = useState([]); // uploaded files from contract
    const [doneLookingFiles, setdoneLookingFiles,] = useState(false); // uploaded files from contract

/**
 *  Read from contract the list of RFP (requesting documents) metadata files on the
 *  current RFP. Read from contract the list of bidders on the contract 
 */
const updateRFPFilesArray = useCallback( async () => {
  setdoneLookingFiles(false)
  // rfpidx is the global RFP index to track for documents
  if (typeof rfpidx=== 'undefined')  {
      setdoneLookingFiles(true)
       return {status:true}
  }
  const result = await getArweaveFilesMetadata(rfpidx) // get RFP arweave metadata files from contract
  if (result.status) {
      setRFPFiles(result.docs)
      console.log('Result Dosc:', result.docs)
      setNewFiles(false)
      setdoneLookingFiles(true)
      return {status:true}
  } else {
      setdoneLookingFiles(true)
      return {status:false, message:result.error}
    }
  },[rfpidx])

  
  useEffect(() => {
    if (newfiles) updateRFPFilesArray();
  }, [newfiles, updateRFPFilesArray]);



  return {newfiles, setNewFiles, rfpfiles, setRFPFiles, updateRFPFilesArray, doneLookingFiles}
}