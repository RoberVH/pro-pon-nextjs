import { connectToDatabase } from "../../database/mongodb";
import {  ObjectId } from 'mongodb';

export default async function handler (req, res) {
  const { db } = await connectToDatabase();
  const { method } = req

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
      query.sender = new RegExp('^'+params.sender, "i")
      const pendingtxs = await db
      .collection("pendingTxs")
      .find(query)
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();
      res.json(pendingtxs);
      break
    case 'POST':
        try {
          await db
          .collection("pendingTxs")
          .insertOne(req.body)
          res.status(201).json({ status: true })
        } catch (error) {
          console.log('error pendingTx creation', error)
          res.status(400).json({ status: false, msg:'Internal server Error' })
        }
    case 'DELETE':
      const removeObj = req.body;
      let filter = {};
      let deletedCount = 0;
      try {
        if (removeObj._id) 
              filter = { _id: ObjectId(removeObj._id) };
          else if (removeObj.sender) 
          // filter = { sender: removeObj.sender };
              filter = { sender: { $regex: new RegExp(removeObj.sender, "i") } }
           else {
              return res.status(400).json({ error: 'Invalid request data' });
        }
        const result = await db.collection("pendingTxs").deleteMany(filter);
        deletedCount = result.deletedCount;
        if (deletedCount === 0) {
          return res.status(404).json({ error: 'Document(s) not found' });
        }
        res.status(200).json({ deletedCount });
      } catch (error) {
        console.log('error pendingTx deletion', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  }
}