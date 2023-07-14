import React from 'react'

export default function processBDerror(err) {
    let errMsg;
    // a name property exists? then is a MongoDB error and shall we use name property, otherwise use message prop
    if (!typeof err.name==='undefined') errMsg=err.name
    else  errMsg=err.message
    console.log('processdb', errMsg)
    let status,message;
    switch (errMsg) {
        case 'MongoNetworkError':
            status=503,
            message= 'err_bd_network'       // Trouble connecting to the database
            break
        case 'ValidationError':
            status=400,
            message= 'err_bd_validation'    //  There was a problem with your request
            break
        case 'MongoServerError':
            status=503,
            message= 'err_bd_ill_request'   //  There was a problem with your request 
            break    
        case 'MongoTimeoutError':
            status=408,
            message= 'err_bd_timeout'       //  There was a problem with your request 
            break     
        case 'MongoServerSelectionError':
            status=503
            message= 'db_connection_timed_out'
            break
        case 'Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON':
            status=503
            message= 'db_unreachable'
            break
        case 'tx_not_found':
                status=503
                message= 'tx_not_found'
                break     
        case 'err_bd_ill_request':
                status=503
                message= 'err_bd_ill_request'
                break                     
        default:
            status=500,
            message= 'err_bd_undetermined'  //  unkwon error
      }
    return ({
        status:status,
        message:message
    })
}
