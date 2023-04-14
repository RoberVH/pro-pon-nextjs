import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  // Find just the one company described in the params 
  const companiesDB = await db
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
      console.log('terms', query)
      const companies = await db
      .collection("companies")
      .findOne(query)
      if (!companies) {res.status(200).json({}); break}
      res.status(200).json(companies);
      break
    case 'POST':
      try {
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