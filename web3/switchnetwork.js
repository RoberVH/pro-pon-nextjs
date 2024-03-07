  /*************************************************************
     * switchNetwork -
     *     Prompt  Metamask to change network to NEXT_PUBLIC_NETWORK_VERSION Testnet
     *
     **********************************************************/
   export const switchNetwork = async () => {
    if (window.ethereum) {
        const network='0x'+ parseInt(process.env.NEXT_PUBLIC_NETWORK_VERSION).toString(16) 
        //const network= '0x' + process.env.NEXT_PUBLIC_NETWORK_VERSION
      try {
        // Try to switch to the working blockchain network
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: network }], // Check networks.js for hexadecimal network ids
        });
        return {status:true}
        } catch (error) {
          return {status:false, error}
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    } 
  }