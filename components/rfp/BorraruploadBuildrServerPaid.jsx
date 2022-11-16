/**
 * UploadBuildrServerPaid -< cambiar a formDisplayUploadingBundlr o algo asi
 *  Component to display progress of uploading files to Arweave through Buildr.
 *      
 */

import { useState, useEffect } from "react"
import { onError } from "../../web3/decodeError"
import BottomSignMsg from "../layouts/bottomSignMsg"


function UploadBuildrServerPaid({ t, files }) {

  const onSuccess = async (message, signature) => {
    // Verify signature when sign message succeeds
    //const address = verifyMessage(message, signature)
    const result = await verifyData_Save(message, signature);
    if (result.status) {
      toast.success(t("companydataadded", toastStyleSuccess));
      setCompanyData(JSON.parse(message));
    } else errToasterBox(result.message);
    setSaving(false);
  };

  const onError = onError(error, t, "gralerrors");

  const signMessage = useSignMessage({ onSuccess, onError });
  const proceedOperation = async () => {
    setDisplayFlag(false);
  };

  if (displayFlag)
    return (
      <BottomSignMsg
        message={t("uploadrequestsigning", { ns: "rfps" })}
        handleOperation={proceedOperation}
        buttonAction={t("accept", { ns: "rfps" })}
      />
    );
  return <div></div>;
}

export default UploadBuildrServerPaid;
