import { connectToDatabase } from "../../database/mongodb";
import { ObjectId } from "mongodb";
import { verifyMessage } from "ethers/lib/utils";
import { accountHasRigths, getRFP } from "../../web3/serveraccessweb3";
import { IdxDocTypes } from "../.././utils/constants";
import { buildQuery } from "../../database/serverDBUtils";
import { isEmpty } from "../../utils/misc";
import { convUnixEpoch } from "../../utils/misc";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  switch (method) {
    // GET - consult and retrieve secrets for requested fil
    // first check if date is allowed, and for confidential file check if requester is owner of RFP
    // Receives and object with needing properties for the docType
    // Private & confidential Files: globalIndex and arweaveFileIdx
    // Confidential files: additionally: message object having above properties plus a signature of requester
    // requester signing must be issuer of the RFP to get the secrets for decrypt the file
    case "GET":
      const params = JSON.parse(req.query.requestFileObject);
      const { globalIndex, arweaveFileIdx } = params;
      // first check, the date time is past endreceivingdatetime,
      const result = await getRFP(globalIndex);
      if (!result.status) {
        res.status(200).json({ status: false, message: result.message });
        break;
      }
      if (
        parseInt(result.RFP.endReceivingDate.toString()) >
        convUnixEpoch(new Date())
      ) {
        // not reached allowed time yet
        res.status(200).json({ status: false, message: "notimetodownload" });
        break;
      }
      // need to get secrets of requested file to check its docType
      const secretsQuery = buildQuery({ idx: arweaveFileIdx });
      const secrets = await db
        .collection("secrets")
        .find(secretsQuery)
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
      if (!secrets.length >= 1) {
        res.status(200).json({ status: false, message: "no_secrets" });
        break;
      }
      //checks for confidential file
      if (secrets[0].docType === IdxDocTypes.documentProposalType.toString()) {
        // is confidential, check requisites
        const { signature, msg } = params;
        if (!signature || !msg) {
          res
            .status(200)
            .json({ status: false, message: "no_valid_signature" });
          break;
        }
        try {
          var account = verifyMessage(JSON.stringify(msg), signature);
        } catch (error) {
          res
            .status(200)
            .json({ status: false, message: "bad_signed_message" });
          break;
        }
        if (result.RFP.issuer.toLowerCase() !== account.toLowerCase()) {
          res
            .status(200)
            .json({ status: false, message: "only_ownerrfp_doctpye" });
          break;
        }
      }
      // if make it up to here then everything is fine watheaver it's confidential or private, deliver secrets
      res.status(200).json({ status: true, secrets: secrets[0] });
      break;
    case "POST": //  post one secret data
      if (isEmpty(req.body)) {
        res.status(200).json({ status: false, msg: "no_data_to_save" });
        return;
      }
      try {
        const data = await db.collection("secrets").insertOne(req.body);
        res.status(200).json({ status: true, _id: data.insertedId.toString() });
        break;
      } catch (error) {
        console.log("Error filedata", error);
        res.status(400).json({ status: false, msg: error });
        break;
      }
    default:
      res.status(400).json({ status: false, msg: "Error desconocido" });
      break;
  }
}
