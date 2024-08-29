/******************************************************************
 *  checkMMAccounts - check if we already  have  permissions to Metamask account
*****************************************************************/
export const checkMMAccounts = async (setAddress) => {
  if (typeof window === "undefined" || !window.ethereum) {
        return;
      }
    const accounts = await ethereum.request({method: 'eth_accounts'})
    if (accounts.length !==0) {
        setAddress(accounts[0])
        } 
    }