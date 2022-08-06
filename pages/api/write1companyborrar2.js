import { connectToDatabase } from "../../database/mongodb";

export default async  function handler (req, res)  {
  const { db } = await connectToDatabase();
      try {
        const companies = await db
        .collection("companies")
        .insertOne({
          "adminName": "Frank Millhouse",
          "companyName": "Frostbound, Inc.",
          "TaxPayerCompanyId":"0002-45622-788 ",
          "emailCompany":"sales_dep@frostbound.com",
          "website":"www.frostbound.com",
          "country":"United States of America"
        })
        res.status(201).json({ msg: 'OK'})
        } catch (error) {
        res.status(400).json({ msg: 'No se pudo registrar' })
        }
}