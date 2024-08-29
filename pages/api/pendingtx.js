import { connectToDatabase } from "../../database/mongodb";
import {  ObjectId } from 'mongodb';
import processBDerror from '../../database/processBDerror'

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req
  switch (method) {
    case 'GET':
      try {
        //throw new Error('MongoTimeoutError')
       const query={}
      query['$and']=[]
      const term={}
       const params = req.query
       for (const key in params) {
         term[key]=new RegExp('^'+params[key], "i")
        query['$and'].push(term)
       }
      query.sender = new RegExp('^'+params.sender, "i")
      const pendingtxs = await db
      .collection("pendingTxs")
      .find(query)
      .sort({ _id: 1 })
      .limit(20)
      .toArray();
      res.json({status:true, res:pendingtxs});
      break
    } catch(error) {
      const {status, message} = processBDerror(error)
      res.status(403).send( {status:false, msg:message} )
      return
    }
    case 'POST':
        try {
          await db
          .collection("pendingTxs")
          .insertOne(req.body)
                    res.status(201).json({ status: true })
          return
        } catch (error) {
          const {status, message} = processBDerror(error)
          res.status(status).json({ status: false, msg:message }) 
          break;          
        }
        break
    case 'DELETE':
      // removeObj can hace one of there params: 
      // {sender: address} it's remove all pending TXs
      //  or {_id: id} remove specific Tx with _id given on id
      const removeObj = req.body;
      //const removeObj = {};
      let filter = {};
      let deletedCount = 0;
      try {
        if (removeObj._id) 
              filter = { _id: ObjectId(removeObj._id) };
          else if (removeObj.sender) 
              filter = { sender: { $regex: new RegExp(removeObj.sender, "i") } }
           else {
              //return res.status(400).json({ status:false, msg: 'Invalid_params' });
              throw new Error('err_bd_ill_request')
        }
        const result = await db.collection("pendingTxs").deleteMany(filter);
        deletedCount = result.deletedCount;
        if (deletedCount === 0) {
          //return res.status(404).json({ status:false, msg: 'not_found' });
          throw new Error('tx_not_found')

        }
        res.status(200).json({status:true, deletedCount:deletedCount });
      } catch (error) {
        const {status, message} = processBDerror(error)
        res.status(status).json({ status:false, msg:message });
      }
      default:
        res.status(503).json({status:false, msg:'err_bd_ill_request'})
        break      
  }
}