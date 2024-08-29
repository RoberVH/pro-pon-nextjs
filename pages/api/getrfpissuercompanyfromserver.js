/**
 * /api/getrfpissuercompanyfromserver
 *   Get the Company address of the RFP with rpfidx index
 */
import { getProponContractServer } from "../../web3/servercontractsettings";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      // get the bundler instance from the key we use at the server
      try {
          let result = await getProponContractServer();
          if (!result.status) {
              throw new Error(result.error);
            }
          const proponContract = result.contract;
          let rfpIDX = req.query.rfpidx
          result = await proponContract.getRFPIssuer(rfpIDX)
          res.status(200).send({ status: true, address: result });
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
