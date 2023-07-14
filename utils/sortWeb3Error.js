/**
 * sortWeb3Error
 * @abstract Some server methods deal both with database and web3 returning data and possible two sources of errors on try-catch code segments
 *           Because both of them gie a different property with the error (message vs reason) this routine check what possibilities
 *           and return a normailizaed 
 * @param {*} error 
 * @returns An string with the error message error.message or error.reason
 */

export const sortWeb3Error = (error) => {
    let errorMessage = 'undetermined_blockchain_error';
            if (error.reason) {
                errorMessage = error.reason;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.data && error.data.message) {
                errorMessage = error.data.message;
            }
    return errorMessage
    }

