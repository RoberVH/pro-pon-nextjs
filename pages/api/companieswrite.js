import { connectToDatabase } from "../../database/mongodb";

export default async  function handler (req, res)  {
  const { db } = await connectToDatabase();

      try {
        const companies = await db
        .collection("companies")
        .insertOne({
          "adminName": "Julia Livermore",
          "companyName": "NytroPlex, Inc.",
          "TaxPayerCompanyId":"CODIISU034298343-234234-2342",
          "emailCompany":"sales@nytroplex.com",
          "website":"www.nytroplex.com",
          "country":"USA"
        })
        res.status(201).json({ msg: 'OK'})
        } catch (error) {
        res.status(400).json({ msg: 'No se pudo registrar' })
        }
}