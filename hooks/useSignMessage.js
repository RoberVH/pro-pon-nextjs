import { ethers } from 'ethers'

// Have to change WAGMI to ethereum provider on browser and Ethers as
// Bundlr still doesn't support WAGMI, so I modified the Wagmi Hooks to acommodate as much as 
// possible dependent old code
// Sign the passed message with current window.ethereum provider account

export const useSignMessage = ({onSuccess,onError}) => {
  const signMessage = async (message) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signature = await signer.signMessage(message)
        onSuccess(message, signature)
    } catch (error) {
        onError(error);
    }       
  };
   return (signMessage)
};


