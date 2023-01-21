import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  // Find just the one rfp based on MongoDB generated _id field in the param rfpId
  const rfpDB = await db
  switch (method) {
    case 'GET':
      const params = req.query
      const id = params['rfpId']
      const rfp = await db
        .collection("rfps")
        .findOne({_id : ObjectId(id)})
      if (!rfp) {res.status(200).json({}); break}
      res.status(200).json(rfp);
      break
    default:
      res.status(400).json({ status: false, msg:'Error desconocido' })
      break
  }
}