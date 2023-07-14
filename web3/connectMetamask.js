/*******************************************************************
* connectMetamask
    - Request connection to  MM accounts 
*   - user authorize and connects accounts: set address variable state
*   - user denies access: return error
*****************************************************************/
export const connectMetamask = async (setAddress) => {
    if (!window.ethereum) {
      return {status:false, message:'nometamask'}
    }
    let message=''
    try {
      const accounts= await window.ethereum.request({method: 'eth_requestAccounts'})
      return {status:true, address:accounts[0]}
    } catch (error )  {
      console.log('connect error', error)
        if (error && error.code===4001) return ({status:false, message:'userreject'})
        else if (error && error.message) return ({status:false, message:error.message}) 
             else return ({status:false, message:error}) 
  }
}