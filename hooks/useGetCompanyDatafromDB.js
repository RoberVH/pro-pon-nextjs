

async function useGetCompanyDatafromDB(companyId) {
    console.log('useGetCompanyDatafromDB')
    const params=new URLSearchParams({companyId:companyId})
    const url=`/api/readonecompany?${params}`
    try {
          const response = await fetch(url);
          const data = await response.json();
          console.log('response from server:', data)
          return data;
    } catch (error) {
        console.log("Error del server:", error.message);
      return (error)
    }
}

export default useGetCompanyDatafromDB