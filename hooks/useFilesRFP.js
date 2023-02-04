import { useState, useEffect, useCallback } from 'react'
import { getArweaveFilesMetadata } from '../web3/getArweaveFilesMetadata'
// import { getContractRFPbidders } from '../web3/getContractRFPbidders'

export const  useFilesRFP= (rfpRecord) => {
    const [newfiles, setNewFiles] = useState(false); // flag to refresh RFP files loaded. Get them from contract
    const [rfpfiles, setRFPFiles] = useState([]); // uploaded files from contract

/**
 *  Read from contract the list of RFP (requesting documents) metadata files on the
 *  current RFP. Read from contract the list of bidders on the contract 
 */
const updateRFPFilesArray = useCallback( async () => {
    if (!rfpRecord || !rfpRecord.rfpidx)  return
    
    const result = await getArweaveFilesMetadata(rfpRecord.rfpidx) // get RFP arweave metadata files from contract
      if (result.status) {
        setRFPFiles(result.docs)
        setNewFiles(false)
    } else {
        errToasterBox(result.error)
        console.log('Error', result.error)
      }
  },[rfpRecord])

  
  useEffect(() => {
    if (newfiles) updateRFPFilesArray();
  }, [newfiles, updateRFPFilesArray]);



  return {newfiles, setNewFiles, rfpfiles, setRFPFiles, updateRFPFilesArray}
}