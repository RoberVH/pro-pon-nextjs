import { connectToDatabase } from "../../database/mongodb";
//import  { ObjectId } from 'mongodb'
//import { verifyMessage } from 'ethers/lib/utils'

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  const companiesDB = await db
      try {
        const companies = await db
        .collection("companies")
        .insertOne(req.body)
        res.status(201).json({ status: true })
      } catch (error) {
        console.log('error companycreation', error)
        res.status(400).json({ status: false, msg:'Mi errorsotote' })
      }
}