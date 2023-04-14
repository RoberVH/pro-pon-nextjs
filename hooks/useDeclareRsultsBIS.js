import { ethers } from 'ethers';
import { useState } from 'react';
import { getWritingProponContract } from "../web3/contractsettings";

export const useDeclareResultsBIS = (onError, onSuccess) => {
  const [postedHash, setPostedHash] = useState();
  const [block, setBlock] = useState();
  const [link, setLink] = useState();
  const [blockchainsuccess, setBlockchainsuccess] = useState(false);

  const write = async (
    rfpidx,
    companyId,
    winners
  ) => {
    const proponContract = await getWritingProponContract();
    // make sure a clean state in case this is consecutive second time called
    setBlockchainsuccess(false);
    setBlock(false);
    setLink(false);
    setPostedHash(false);

    try {
      // Create a new promise that resolves or rejects after a timeout
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(new Error('Transaction timed out'));
        }, 60000); // Timeout after 60 seconds
      });

      // Use Promise.race() to wait for either the contract call or the timeout promise
      const Tx = await Promise.race([
        proponContract.declareWinners(rfpidx, companyId, winners),
        timeoutPromise
      ]);

      setPostedHash(Tx.hash);
      setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`);
      const data = await Tx.wait();
      setBlock(data.blockNumber);
      setBlockchainsuccess(true);
      onSuccess();
    } catch (error) {
        console.log('BIS:', error)
      onError(error);
    }
  };
  return { write, postedHash, block, link, blockchainsuccess };
};
