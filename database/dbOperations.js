/**
 * 
 * DB Layer. Functions to middle between client and Propon Database
 * 
 */

import processBDerror from "./processBDerror";

// retrieve from DB companyData record with passed companyId identifier
export const  getCompanydataDB = async (companyId) =>  {
  const params=new URLSearchParams({companyId:companyId})
  const url=`/api/readonecompany?${params}`
  try {
        const response = await fetch(url);
        const resp = await response.json();
        if (!response.ok) {
          const msgErr= processBDerror(resp.msg)
            return({status:false, msg:msgErr.message})
        }        
        return {status:true, data:  resp}
  } catch (error) {
    const msgErr= processBDerror(error)
    return ({status:false, msg:msgErr.message})
  }
}

// Verify a message before to apply it to DataBase to modify r/w company records collection database
export const verifyData_Save = async (message, signature) => {
    let method = "PATCH";
    const webload= {signature:signature,...JSON.parse(message) } // destringify message because it was stringiy for signing
    try {
      const response = await fetch("/api/servercompanies", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webload),
      });
      const resp = await response.json()
      if (response.ok) return {status:true}
          else return { status:false, msg: resp.msg}
    } catch (error) {
            // other error kind, not mongoDB
            const msgErr= processBDerror(error)
            return {status:false, msg: error.message}
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
      if (!response.ok) {
        return { status: false, msg: resp.msg};
      }
      return {status:true, msg: resp};
    } catch (error) {
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
        if (!resp.status) {
          throw new Error (resp.msg)
        }
        return {status:true, resp:resp._id};
      } catch (error) {
        return ({status:false, message:error.message});
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
      const resp=await response.json()

      if (!resp.status) {
        new Error(resp.msg)
      }
      return resp
    } catch (error) {
      // Handle the error and return a rejected promise
      return await Promise.reject(error);   // sugerencia de chatgpt: solo: throw error
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
      const resp=await response.json()
      if (!resp.status) {
          return {status:false, msg:resp.msg} 
      }
      return {status:true, secrets:resp.secrets}
      //return await response.json();  // consult was ok return results( could be 0 or 1 record)
    } catch (error) {
      // Handle the error and return a rejected promise
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
      if (!response.ok) {
        throw new Error(resp.msg)
      }
      return resp
    } catch (error) {
      return ({status:false, msg:error.message});
    } 
  };
 
  export const savePendingTx = async (objTx) => {
    let method = "POST";
    try {
      const response = await fetch("/api/pendingtx", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objTx),
      });
      const resp = await response.json();
      if (!response.ok) {
        throw new Error(resp.msg)
      }
      return {status:true, resp:resp}
    } catch (error) {
      return ({status:false, msg:error.message});
    }
  }

  export const getPendingTxs = async (issuer) => {
    try {
        const response = await fetch(`/api/pendingtx?${new URLSearchParams(issuer)}`);
        const resp = await response.json()
        if (!resp.status) {
          throw new Error(resp.msg)
        }
        return {status:true, res:resp.res}
    } catch (error) {
      return ({status:false, message:error.message});
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
    const resp = await response.json();
    if (!resp.status) {
      throw new Error(resp.msg)
    }
    return {status: true, response: resp.deletedCount };
  } catch (error) {
    return { status: false, msg: error.message };
  }
  
  }
