import { connectToDatabase } from "../../database/mongodb";

export default async  function handler (req, res)  {
  const { db } = await connectToDatabase();
  const { method } = req
  
  switch (method) {
    case 'GET':
        console.log('companies hit')
        const companies = await db
        .collection("companies")
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
        res.json({companies});
        break
    case 'POST':
      try {
        const companies = await db
        .collection("companies")
        .insert({
          "adminName": "Severiano Martínez",
          "companyName": "Soberemex, S.A.",
          "TaxPayerCompanyId":"SOB190411CO4",
          "emailCompany":"sever@yahoo.com",
          "website":"www.soberemex.mx",
          "country":"Mexico"
        })
        res.status(201).json({ msg: 'OK'})
        } catch (error) {
        res.status(400).json({ msg: 'No se pudo registrar' })
        }
  }
}