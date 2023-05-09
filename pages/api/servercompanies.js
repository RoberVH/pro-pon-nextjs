import { connectToDatabase } from "../../database/mongodb";
import  { ObjectId } from 'mongodb'
import { verifyMessage } from 'ethers/lib/utils'
import { accountHasRigths } from '../../web3/serveraccessweb3'

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
    case 'PATCH':  //  Verify passed signed data and if succesful modify company data at Data Base
      // first check the company is not already registered
      const {signature,...msg} = req.body
      const account= verifyMessage(JSON.stringify(msg), signature)
      if ( !await accountHasRigths(account, msg.companyId)) {
          res.status(400).json({
              status: false, 
              message:`Account ${account.slice(0,5)}...${account.slice(-6)}  not admin of company with ID: ${msg.companyId}`  })
          return
      }
      msg.profileCompleted=true
      try {
        const cursor = await db.collection("companies").find({companyId:req.body.companyId})
        const results = await cursor.toArray()
        if (results.length >= 0)  {
          // there is a copany record for this company at DB, strip it off the essential data already there
            const uniqueIdRecord = req.body._id
            delete msg._id
            delete msg.companyId
            delete msg.companyname
            delete msg.country
            delete msg.address
            await db
            .collection("companies")
            .updateOne({_id:ObjectId(uniqueIdRecord)},{$set: msg}) 
            res.status(201).json({ status: true })
        } else {
          // there is Not a  Company record at DB. This could happen if transaction was let pending
          // and however, it finally came through. So to sync Contract with DB lets create the record
          // with the data coming from edit profile that is itself coming from contract
          delete msg._id
          const companies = await db
          .collection("companies")
          .insertOne(msg)
          res.status(201).json({ status: true })          
          return
        }    
        } catch (error) {
          console.log('Error servercompanies', error)
          res.status(400).json({ status: false, msg:'Error at api/servercompanies' })
        }
        break
      default:
        res.status(400).json({ status: false, msg:'Unkown Error' })
        break
    }

  
}