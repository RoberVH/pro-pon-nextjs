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
    case 'PATCH':  //  modify company data
      const {signature,...msg} = req.body
      console.log('signature',signature)
      console.log('msg',msg)
      const account=await verifyMessage(JSON.stringify(msg), signature)
      if ( !await accountHasRigths(account, msg.companyId)) {
          res.status(400).json({ status: false, 
            message:`Account ${account.slice(0,5)}...${account.slice(-6)}  not admin of company with ID: ${msg.companyId}`  })
          break
      }
      msg.profileCompleted=true
        try {
          const uniqueIdRecord = req.body._id
          console.log('Previa', msg)
          delete msg._id
          delete msg.companyId
          delete msg.companyname
          delete msg.country
          console.log('Post', msg)
          await db
          .collection("companies")
          .updateOne({_id:ObjectId(uniqueIdRecord)},{$set: msg}) 
          res.status(201).json({ status: true })
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