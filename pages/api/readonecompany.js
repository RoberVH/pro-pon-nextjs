import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  // Find just the one company described in the params, mainly companyid
  const companiesDB = await db
  switch (method) {
    case 'GET':
      const query={}
      console.log('query',req.query)
      query['$and']=[]
      const term={}
      const params = req.query
      console.log('params', params)
      for (const key in params) {
        term[key]=new RegExp('^'+params[key], "i")
        console.log('term',term)
        query['$and'].push(term)
      }
      console.log(query)
      const companies = await db
      .collection("companies")
      .findOne(query)
      console.log('companies', companies)
      if (!companies) {res.status(200).json({}); break}
      res.status(200).json(companies);
      break
    case 'POST':
      try {
        console.log('companies hit with post and values: ', req.body)
        const companies = await db
        .collection("companies")
        .insertOne(req.body)
        res.status(201).json({ status: true })
      } catch (error) {
        res.status(400).json({ status: false, msg:'Mi errorsotote' })
      }
      break
    default:
      res.status(400).json({ status: false, msg:'Error desconocido' })
      break
  }
}