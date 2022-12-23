/******************************************************************
 *  checkMMAccounts - check if we already  have  permissions to Metamask account
*****************************************************************/
export const checkMMAccounts = async (setAddress) => {
    if (!window || !window.ethereum) {
        return;
      }
    const accounts = await ethereum.request({method: 'eth_accounts'})
    if (accounts.length !==0) {
        console.log('setting addres en checkMAAccounts', accounts[0])
        setAddress(accounts[0])
        } 
    }