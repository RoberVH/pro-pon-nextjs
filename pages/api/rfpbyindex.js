import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId, ReturnDocument } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'
import { accountHasRigths } from '../../web3/serveraccessweb3'
import { buildQuery } from '../../database/serverDBUtils'
import { isEmpty } from "../../utils/misc"
import processBDerror from "../../database/processBDerror";


// Read from DB the RFP record based on the rfpidx index passed in request
export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  
  switch (method) {
    case 'GET':
      try {
        const numericIdx = req.query.rfpidx
        if (isNaN(numericIdx)) {
            res.status(400).json({ status: false, msg:'bad_method' })
            return
        }
        const query = { rfpidx: parseInt(numericIdx,10) }
        const rfps = await db
          .collection("rfps")
          .find(query)
          .sort({ _id: 1 })
          .toArray();
        res.status(200).json({status:true, result:rfps})
        break
      } catch (error) {
        const {status, message} = processBDerror(error)
        res.status(status).json({ status: false, msg:message })
        break
      }
      default:
        res.status(400).json({ status: false, msg:'bad_method' })
        break
    }
}