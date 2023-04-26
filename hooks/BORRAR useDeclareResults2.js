import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getWritingProponContract } from '../web3/contractsettings';

export const useDeclareResults2 = (onError, onSuccess, controller) => {
  const [postedHash, setPostedHash] = useState();
  const [block, setBlock] = useState();
  const [link, setLink] = useState();
  const [blockchainsuccess, setBlockchainsuccess] = useState(false);

  const write = async (rfpidx, companyId, winners) => {
    const proponContract = await getWritingProponContract();
    // make sure a clean state in case this is consecutive second time called
    setBlockchainsuccess(false);
    setBlock(false);
    setLink(false);
    setPostedHash(false);
    try {
      const Tx = await proponContract.declareWinners(rfpidx, companyId, winners);
      setPostedHash(Tx.hash);
      setLink(`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${Tx.hash}`);
       const data = await Promise.race([
         Tx.wait(),
              new Promise((_, reject) => controller.signal.addEventListener('abort',  () =>
              reject(new Error('AbortError'))
            ))
       ]);
      setBlock(data.blockNumber);
      setBlockchainsuccess(true);
      onSuccess();
    } catch (error) {
      if (error.name === 'AbortError') {
          console.log('User cancelled transaction!!!. Controller.signal',controller.signal);
      } else {
        console.log('error was not AbortError')
        onError(error);
      }
    }
  };
  return { write, postedHash, block, link, blockchainsuccess };
};

