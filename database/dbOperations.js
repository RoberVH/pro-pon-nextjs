
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
      console.log('Resp del server:', resp)
      if (resp.status) return {status:true}
        else return {status:false, message: resp.message}
    } catch (error) {
      console.log("Error del server:", error.message);
      return {status:false, message: error.message}
    } 
  };

  // Create initial record for company at database, set profileCompleted to false
  export const saveCompanyID2DB = async (companyId, companyname) => {
    let method = "POST";
    const webload= {profileCompleted:false, companyId, companyname}
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
      console.log('saveRFP2DB params:',rfpParams)
      //const webload= rfpParams
      try {
        const response = await fetch("/api/serverrfp", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rfpParams),
        });
        const resp = await response.json();
        return;
      } catch (error) {
        console.log("Error del server:", error);
        errToasterBox(error, toastStyle);
      } 
    }