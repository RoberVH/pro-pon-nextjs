import { ethers } from 'ethers'
// import { CONTRACT_ADDRESS } from '../web3/proponcontractAddress'
// import CONTRACT_ABI from './pro_pon.json'

export const  getPendingTxStatuses  = async (pendingTxs) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_BROWSER);
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


// historicTxs show receipts of Txs
// export const historicTxs = async (from) => {
// const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_BROWSER);
// //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");

// const contractAddress = CONTRACT_ADDRESS
// const senderAddress = from
// // const topics = [
// //   ethers.utils.id("Transfer(address,address,uint256)"),
// //   ethers.utils.hexZeroPad(senderAddress, 32),
// //   ethers.utils.hexZeroPad(contractAddress, 32),
// // ];
// const topics = [
//   ethers.utils.id("Transfer(address,address,uint256)"),
//   //ethers.utils.id("NewRFPCreated(address,uint256,string)"),
//   null,
//   ethers.utils.hexZeroPad(senderAddress, 32),
// ];
// const currentBlockNumber = await provider.getBlockNumber();
// const fromBlock = currentBlockNumber - 500;
// const toBlock = "latest";
// const filter = {
//   fromBlock,
//   toBlock,
//   topics,
// };

// const logs = await provider.getLogs(filter);
// console.log('logs', logs)
// return logs
// }

// export const allevents = async (from) => {
//   const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_BROWSER);
// const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// const filter = contract.filters.all();
// const events = await contract.queryFilter(filter);
// console.log(events);
// }