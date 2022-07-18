import { connectToDatabase } from "./mongodb";

export default fetchCompanies = async () => {
  
    const { db } = await connectToDatabase();
        console.log('fetchCompanies GET hit')
        try {
        const companies = await db
        .collection("companies")
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
        return companies
    } catch (error) {
    console.log('error durante fetch', error)
    }
 }

 