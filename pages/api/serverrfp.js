import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'
import { accountHasRigths } from '../../web3/serveraccessweb3'
import { buildQuery } from '../../database/serverDBUtils'
import { isEmpty } from "../../utils/misc"
import processBDerror from "../../database/processBDerror";

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  switch (method) {
    case 'GET':
      const query = buildQuery(req.query)
      const rfps = await db
        .collection("rfps")
        .find(query)
        .sort({ _id: 1 })
        .limit(20)
        .toArray();
      res.status(200).json(rfps);
      break
    case 'POST':  //  post one rfp data
      try {
        if (isEmpty(req.body)) {
        }
          // first check there is not another RFP with same Id and account issuer
          const cursor = await db.collection("rfps").find({name:req.body.name, companyId:req.body.companyId})
          const results = await cursor.toArray()
          if (results.length > 0)  {
            // there is a previous RFP already using this RFP id - companyId combination, return the present _id of company
            // this is to avoid duplicated RFP and desync contract and DB, 
            res.status(200).json({ status: true, _id:results[0]._id.toString() })
            return
          }
          const data= await db
            .collection("rfps")
            .insertOne(req.body)
          res.status(200).json({status:true, _id:data.insertedId.toString()})
          break
      } catch (error) {
        const {status, message} = processBDerror(error)
          res.status(status).json({ status: false, msg:message })
          break
      }
    case 'PATCH':  //  modify rfp data
      const {signature,...msg} = req.body
      //const account=await verifyMessage(JSON.stringify(msg), signature)
      const account= verifyMessage(JSON.stringify(msg), signature)
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
          break
        } catch (error) {
          res.status(400).json({ status: false, msg:'Mi errorsotote' })
          break
        }
      default:
        res.status(400).json({ status: false, msg:'Error desconocido' })
        break
    }

  
}