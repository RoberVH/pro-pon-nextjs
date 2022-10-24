/******************************************************************
 *  checkMMAccounts - check if we already  have  permissions to Metamask account
*****************************************************************/
export const checkMMAccounts = async (setAddress) => {
    if (!window) return
    if (window.ethereum) {
        const accounts = await ethereum.request({method: 'eth_accounts',
    })
        if (accounts.length !==0) {
            setAddress(accounts[0])
           }
    }
   }