import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  const companiesDB = await db
      try {
        // first check the company is not already registered
        const cursor = await db.collection("companies").find({companyId:req.body.companyId})
        const results = await cursor.toArray()
        if (results.length > 0)  {
          // there is a previously Company already using this  company Id , do nothing
          // this is surely a reply of the recording transaction, as the contract
          // anyway forbids used company Id to be use for another one, so lets  avoid duplicated Companies records
          res.status(200).json({ status: true, _id:results[0]._id.toString()})
          return
        }
        // there is not registered company with that data, proceed:
        const companies = await db
        .collection("companies")
        .insertOne(req.body)
        res.status(201).json({ status: true })
      } catch (error) {
        console.log('error companycreation', error)
        res.status(400).json({ status: false, msg:'Mi errorsotote' })
      }
}