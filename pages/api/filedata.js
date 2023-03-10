import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'
import { accountHasRigths } from '../../web3/serveraccessweb3'
import { buildQuery } from '../../database/serverDBUtils'
import { isEmpty } from "../../utils/misc"

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  switch (method) {
    case 'GET':
      const query = buildQuery(req.query)
      console.log('Hit DB with query:', query)
      const secrets = await db
        .collection("secrets")
        .find(query)
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
      res.status(200).json(secrets);
      break
    case 'POST':  //  post one secret data
      if (isEmpty(req.body)) {
        res.status(400).json({ status: false, msg:'no_data_to_save' })
        return
      }
      try {
        const data= await db
          .collection("secrets")
          .insertOne(req.body)
        res.status(200).json({status:true, _id:data.insertedId.toString()})
        break
      } catch (error) {
          console.log('Error filedata', error)
          res.status(400).json({ status: false, msg:error })
          break
      }
      default:
        res.status(400).json({ status: false, msg:'Error desconocido' })
        break
    }

  
}