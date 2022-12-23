// Op to be called from Server related to DataBase
// Calling my routes (/api/...) require full URL address
import { convUnixEpoch } from '../utils/misc'


//  getRFPbyId(rfpId)
// Obtain RFPId record from DataBase MOngoDB base on MongoDB-generated _id field
  export const getRFPbyId = async (rfpId) => {
    const params=new URLSearchParams({rfpId:rfpId})
    const url=process.env.NEXT_PUBLIC_PROPON_URL + `/api/readonerfp?${params}`
    try {
      const response = await fetch(url)
      const resp = await response.json();
      return resp
    } catch (error) {
      console.log("Error del server:", error);
    }       
  }


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
            expr ={[key] : new RegExp('^'+params[key], "i")}
        }
        query['$and'].push(expr)
    }
    return query
}