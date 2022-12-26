import { errorSmartContract } from './constants'

export const parseWeb3Error = (t,error) => {
    console.log('parseerror', error)
    let customError=t('undetermined_blockchain_error',{ns:"gralerrors"})  // default answer, now check if we can specified it
    if (typeof error.reason!== 'undefined') {
    if (error.reason==='insufficient funds for intrinsic transaction cost')
        customError=t('insufficient_funds',{ns:"gralerrors"})
    if (error.reason==='user rejected transaction')
        customError=t('user_rejection',{ns:"gralerrors"})
        // read errors coming from Contract require statements
    if (errorSmartContract.includes(error.reason)) customError=t(error.reason, {ns:"gralerrors"})
    } else {
        if (error.data && error.data.message) customError=error.data.message
        else if (typeof error.message!== 'undefined') customError=error.message
    }
    return customError
}