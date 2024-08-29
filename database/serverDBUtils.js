// Op to be called from Server related to DataBase
// Calling my routes (/api/...) require full URL address
import { convUnixEpoch } from '../utils/misc'

export const buildQuery = (params) => {
    const term=[]
    const query={"$and":[]}
    for (const key in params) {
        let expr={}
        if (key.includes('Date')) {
            // convert from date string to unixepoch to post query to mongoDB
            const unixEpoch = convUnixEpoch( params[key])
            const pos = key.indexOf('_')
            const field = key.slice(0,pos)
            const comparator =  key.slice(pos+1,key.length)
            const operator = (comparator==='ini') ? '$gte' : '$lte'
            const condition = { [operator] : unixEpoch}
            expr = {[field] : condition}
        } else {
            let sanitizedInput = params[key].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            expr ={[key] : new RegExp('^'+sanitizedInput, "i")}
        }
        query['$and'].push(expr)
    }
    return query
}