
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
    const webload= {signature:signature,...JSON.parse(message) }
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
  export const saveCompanyID2DB = async (companyId, companyname, country, address, errToasterBox) => {
    let method = "POST";
    const webload= {profileCompleted:false, companyId, companyname, country, address}
    try {
      const response = await fetch("/api/companycreation", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webload),
      });
      const resp = await response.json(); 
      return;
    } catch (error) {
      console.log("Error del server:", error);
      errToasterBox(error, toastStyle);
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
  //    Receives a string Id of the file secrets record
  
  export const getFileSecrets  = async (idx) => {
    if (idx.trim().length===0) return []
    try {
      const response = await fetch(`/api/filedata?${new URLSearchParams({ idx: idx })}`);
      return await response.json();  // consult was ok return results( could be 0 or 1 record)
    } catch (error) {
      // Handle the error and return a rejected promise
      console.error(error);
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
 