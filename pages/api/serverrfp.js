import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'
import { accountHasRigths } from '../../web3/serveraccessweb3'
import { buildQuery } from '../../database/serverDBUtils'

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  switch (method) {
    case 'GET':
      const query = buildQuery(req.query)
      const rfps = await db
        .collection("rfps")
        .find(query)
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
      res.status(200).json(rfps);
      break
    case 'POST':  //  post one rfp data
            try {
          const data= await db
            .collection("rfps")
            .insertOne(req.body)
          console.log('data',data)
          console.log('id',data.insertedId.toString())
          res.status(200).json({status:true, _id:data.insertedId.toString()})
          break
          res.status(201).json({ status: true },...data)
        } catch (error) {
          console.log('Error serverrfp', error)
          res.status(400).json({ status: false, msg:error })
        }
        break      
    case 'PATCH':  //  modify rfp data
      const {signature,...msg} = req.body
      const account=await verifyMessage(JSON.stringify(msg), signature)
      if ( !accountHasRigths(account, msg.companyId)) {
          res.status(400).json({ status: false, 
            message:`Account ${account.slice(0,5)}...${account.slice(-6)}  not admin of company with ID: ${msg.companyId}`  })
          break
      }
      msg.profileCompleted=true
        try {
          const uniqueIdRecord = req.body._id
          delete msg._id
          await db
          .collection("companies")
          .updateOne({_id:ObjectId(uniqueIdRecord)},{$set: msg}) 
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