// API route serverwarningsignaling
// Log a message error from client 
import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
    const { db } = await connectToDatabase();
    const { method } = req
    
    switch (method) {
        // case 'GET':
        // const query={}
        // query['$and']=[]
        // const term={}
        // const params = req.query
        // for (const key in params) {
        //     term[key]=new RegExp('^'+params[key], "i")
        //     query['$and'].push(term)
        // }
        // const companies = await db
        // .collection("companies")
        // .findOne(query)
        // if (!companies) {res.status(200).json({}); break}
        // res.status(200).json(companies);
        // break
        case 'POST':
        try {
            console.log('Server wargning', req.body)
            const loggingDB = await db
            .collection("Logging")
            .insertOne({...req.body,
                createdAt: new Date(),
                updatedAt: new Date(),})
            res.status(201).json({ status: true })
        } catch (error) {
            res.status(400).json({ status: false, msg:error })
        }
        break
        default:
        res.status(400).json({ status: false, msg:'Unkwon Error' })
        break
    }
    }