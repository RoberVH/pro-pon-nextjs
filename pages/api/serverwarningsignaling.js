// API route serverwarningsignaling
// Log a message error from client 
import { connectToDatabase } from "../../database/mongodb";

export default async function handler (req, res) {
    const { db } = await connectToDatabase();
    const { method } = req
    
    switch (method) {
           case 'POST':
        try {
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