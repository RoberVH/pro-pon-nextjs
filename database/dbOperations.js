//import { ObjectId } from 'mongodb';
//import { serializeArray } from '../utils/serialArrays'

// retrieve from DB companyData record with passed companyId identifier
export const  getCompanydataDB = async (companyId) =>  {
  const params=new URLSearchParams({companyId:companyId})
  const url=`/api/readonecompany?${params}`
  try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
  } catch (error) {
      console.log("Error del server:", error.message);
    return (error)
  }
}

export const verifyData_Save = async (message, signature) => {
    let method = "PATCH";
    const webload= {signature:signature,...JSON.parse(message) } // destringify message because it was stringiy for signing
    try {
      const response = await fetch("/api/servercompanies", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webload),
      });
      const resp = await response.json();
      if (resp.status) return {status:true}
        else return {status:false, message: resp.message}
    } catch (error) {
      console.log("Error del server:", error.message);
      return {status:false, message: error.message}
    } 
  };

  // Create initial record for company at database, set profileCompleted to false
  export const saveCompanyID2DB = async (companyId, companyname, country, address) => {
    let method = "POST";
    const webload= {profileCompleted:false, companyId, companyname, country, address}
    try { 
      const response = await fetch("/api/companycreation", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webload),
      });
      const resp = await response.json(); 
      return {status:true, msg: resp};
    } catch (error) {
      console.log("Error del server:", error);
      return {status: false, msg: error.message}
    } 
  }

    // Create company RFP at  database
    export const saveRFP2DB = async (rfpParams) => {
      let method = "POST";
      try {
        const response = await fetch("/api/serverrfp", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rfpParams),
        });
        const resp = await response.json();
        return resp;
      } catch (error) {
        return ({status:false, msg:error.message});
      } 
    }

  // getDBGuestCompaniesAddresses 
  //    For each company address passed in array companiesAddresses param get its DB record data
  //    Create an array of promises that call the API route for each element in 
  //    the companyAddresses array
  export const getDBCompaniesbyAddress = async (companiesAddresses) => {
    if (companiesAddresses.length===0) return []
  const fetchPromises = companiesAddresses.map(async (address) => {
    try {
      const response = await fetch(`/api/readonecompany?${new URLSearchParams({ address: address })}`);
      return await response.json();
    } catch (error) {
      // Handle the error and return a rejected promise
      console.error(error);
      return await Promise.reject(error);
    }
  });

  // Call Promise.allSettled on the array of promises
  const results = await Promise.allSettled(fetchPromises);

  // Process the results
  const data = results.map((result) => {
    if (result.status === 'fulfilled') {
      // Return the data for successful requests
      return result.value;
    } else {
      // Return null for failed requests
      return null;
    }
  });
  return data;
};

  // getFileSecrets 
  //    For a file idx find the record if exists
  //    Receives and object with needing properties for the docType
  //    Private & confidential Files: globalIndex and arweaveFileIdx 
  //    Confidential files: additionally: message object having above properties plus a signature of requester
  //    requester signing must be issuer of the RFP to get the secrets for decrypt the file
  
  export const getFileSecrets  = async (params) => {
    try {
      const requestFileObject = JSON.stringify(params)
      const queryParams = new URLSearchParams({ requestFileObject }); // Create URLSearchParams object with "requestFileObject" key and value
      const response = await fetch(`/api/filedata?${new URLSearchParams({requestFileObject})}`);
      const res=await response.json()
      if (!res.status) {
          return {status:false, msg:res.message} 
      }
      return {status:true, secrets:res.secrets}
      //return await response.json();  // consult was ok return results( could be 0 or 1 record)
    } catch (error) {
      // Handle the error and return a rejected promise
      console.error('LOCACHE',error);
      return { status: false, msg: error.message }; // something went wrong, return message error
    }
  };
 

  // saveFileSecrets
  //    Save to secrets DB the secrets of a file
  //    Receives a file secrets record {idx:req.body.idx, psw:req.body.psw, iv:req.body.iv }
  // and post it to DB
  
  export const saveFileSecrets  = async (secrets) => {
    if (!secrets) return []
    let method = "POST";
    try {
      const response = await fetch("/api/filedata", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(secrets),
      });
      const resp = await response.json();
      return {resp};
    } catch (error) {
      return ({status:false, msg:error.message});
    } 
  };
 
  export const savePendingTx = async (objTx) => {
    console.log('BD objTx',objTx)
    let method = "POST";
    try {
        console.log('en client still recibi:' , objTx)
      const response = await fetch("/api/pendingtx", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objTx),
      });
      const resp = await response.json();
      return resp
    } catch (error) {
      return ({status:false, msg:error.message});
    }
  }

  export const getPendingTxs = async (issuer) => {
    try {
        const response = await fetch(`/api/pendingtx?${new URLSearchParams(issuer)}`);
        const resp = await response.json()
        return {status:true, res:resp}
    } catch (error) {
      return ({status:false, msg:error.message});
    }
  } 

  export const removePendingTx = async (removeObj) => {
  let method = "DELETE";
  try {
    const response = await fetch("/api/pendingtx", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(removeObj),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      return { status: false, msg: errorData.error };
    }
    const resp = await response.json();
    return {status: true, response: resp };
  } catch (error) {
    console.log('Error caught:', error.message);
    return { status: false, msg: error.message };
  }
  
  }