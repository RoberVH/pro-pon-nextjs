import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  const companiesDB = await db
  //db.products.find( { sku: { $regex: /^ABC/i } } )
  switch (method) {
    case 'GET':
      const query={}
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
      .find(query)
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();
      res.json(companies);
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