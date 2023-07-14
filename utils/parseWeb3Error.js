/**
 * parseWeb3Error
 *      Analyze object error and return a string in the language given by parameter t describing the error
 */
import { errorSmartContract } from './constants'

export const parseWeb3Error = (t,error) => {
    console.log('error', error)
    let customError=t('undetermined_blockchain_error',{ns:"gralerrors"})  // default answer, now check if we can specified it
    if (typeof error.reason!== 'undefined') {
        if (error.reason==='insufficient funds for intrinsic transaction cost'){
            customError=t('insufficient_funds',{ns:"gralerrors"})
        }  else if (error.reason.toUpperCase().includes('USER REJECTED')) {
            customError=t('user_rejection',{ns:"gralerrors"})
        }
        // read errors coming from Contract require statements
        if (errorSmartContract.includes(error.reason)) {
            customError=t(error.reason, {ns:"gralerrors"})
            }
    } else {
        if (error.data && error.data.message) {
            customError=error.data.message
            if (customError.includes('err: insufficient funds for gas')) customError = t('insufficient_funds',{ns:"gralerrors"})
        } else if (typeof error.message!== 'undefined') 
               if (error.message.includes('already pending for origin')) {
                    customError=t('already_pending', {ns:"gralerrors"})
                } else if (error.message.toUpperCase().includes('USER REJECTED')) 
                        customError=t('user_rejection', {ns:"gralerrors"})
                  else if (error.message.includes('bad_method')) 
                        customError=t('bad_method', {ns:"gralerrors"})
                        else {
                            // last chance to catch the error, becasue it was not detected as a Web3 error could be in the general
                            // could be a Database or network-related, that will be parse by the translator
                            // worst case is the error won't be in the translator and it will return as how originally was issued
                            customError=t(error.message,{ns:"gralerrors"})
                        }
    }
    return customError
}