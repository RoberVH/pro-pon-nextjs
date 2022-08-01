import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
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
        console.log('companies hit post with req.body: ', req.body)
        res.status(201).json({ status: true })
        const {signature,...msg} =req.body
        console.log('signature',signature)
        console.log('msg',msg)
        const account=await verifyMessage(JSON.stringify(msg), signature)
        console.log('account:', account)

        break
        const companies = await db
        .collection("companies")
        .insertOne(req.body)
        res.status(201).json({ status: true })
      } catch (error) {
        console.log('error servercompanies', error)
        res.status(400).json({ status: false, msg:'Mi errorsotote' })
      }
      break
    case 'PATCH':
        try {
          console.log('companies hit PATCH with req.body: ', req.body)
          const uniqueIdRecord = req.body._id
          delete req.body._id
          await db
          .collection("companies")
          .updateOne({_id:ObjectId(uniqueIdRecord)},{$set: req.body}) 
          res.status(201).json({ status: true })
        } catch (error) {
          console.log('Error servercompanies', error)
          res.status(400).json({ status: false, msg:'Mi errorsotote' })
        }
        break
      default:
        res.status(400).json({ status: false, msg:'Error desconocido' })
        break
    }

  
}