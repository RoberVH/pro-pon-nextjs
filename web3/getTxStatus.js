import { ethers } from 'ethers'

export const  getPendingTxStatuses  = async (pendingTxs) => {
  try {
    //const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SERVER_LINK  );
    const provider= new ethers.providers.Web3Provider(window.ethereum)
    const statuses = await Promise.all(
      pendingTxs.map(async (tx) => {
        const receipt = await provider.getTransactionReceipt(tx.txHash);
        return {
          ...tx,
          status: receipt ? receipt.status : "pending",
          blockNumber: receipt.blockNumber
        };
      })
    );
    return statuses
  } catch (err) {
    return {msg: err}
  }
}
