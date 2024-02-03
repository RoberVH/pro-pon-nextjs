/**
 * /api/getcontractcompanyfromserver
 *   Get the Company data given on address param  from the Contract
 *  NOTE 1: JavaScript handles objects and arrays. In JavaScript, when an array has additional properties, those properties are
 *  not included when the array is serialized to JSON. This is why some  properties could get
 *  lost when sending arrays from the server to the client. When the Polygon EVM returns the company from contract, it includes all the
 *  props in an array, the Web3 library flesh out the property names and add them to the same object array.
 */
import { getProponContractServer } from "../../web3/servercontractsettings";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
          const result = await getProponContractServer();
          if (!result.status) {
              throw new Error(result.error);
            }
            const proponContract = result.contract;
            let address = req.query.address
        const company = await proponContract.getCompany(address)
        const companyData = {
            id: company.id,
            name: company.name,
            country: company.country,
            RFPParticipations: company.RFPParticipations.map(bn => bn.toString()),
            RFPsWins:  company.RFPsWins.map(bn => bn.toString()),
            company_RFPs: company.company_RFPs.map(bn => bn.toString())
          }
        res.status(200).send({ status: true, company: companyData });
        break;
      } catch (error) {
        res.status(200).send({ status: false, error: error });
        return;
      }
    default:
      res.status(404).send({ status: false, message: "bad_method" });
      break;
  }
}
