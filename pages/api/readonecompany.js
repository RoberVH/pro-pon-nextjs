import { connectToDatabase } from "../../database/mongodb"
import processBDerror  from "../../database/processBDerror"

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  try {
    // Find just the one company described in the params 
    const companiesDB = await db
   // throw new Error('MongoServerSelectionError')
    switch (method) {
      case 'GET':
        const query={}
        query['$and']=[]
        const term={}
        const params = req.query
        for (const key in params) {
          term[key]=new RegExp('^'+params[key], "i")
          query['$and'].push(term)
        }
        const companies = await db
        .collection("companies")
        .findOne(query)
        if (!companies) {
          res.status(200).json({}); 
          return 
        }
        res.status(200).json(companies);
        break
      default:
        res.status(503).json({status:true, msg:'err_bd_ill_request'})
        break
    }
  } catch (error) {
  const {status, message} = processBDerror(error)
  res.status(status).json({ status: false, msg:message })
}
}