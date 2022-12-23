import {  errorSmartContract  } from '../utils/constants'

export const  onError =  async (error, t,lgdomain) => {
    let customError=t('undetermined_blockchain_error',{ns:lgdomain})  // default answer, now check if we can specified it
    if (typeof error.reason!== 'undefined') {
        if (error.reason==='insufficient funds for intrinsic transaction cost')
            customError=t('errors.insufficient_funds',{ns:lgdomain})
        if (error.reason==='user rejected signing')
            customError=t('errors.user_rejection',{ns:lgdomain})
            // read errors coming from Contract require statements
        if (errorSmartContract.includes(error.reason)) customError=t(`${error.reason}`,{ns:lgdomain})
    } else {
        if (error.data && error.data.message) customError=error.data.message
        else if (typeof error.message!== 'undefined') customError=error.message
    }
    errToasterBox(customError)    
    };