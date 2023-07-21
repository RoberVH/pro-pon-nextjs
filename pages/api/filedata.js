import { connectToDatabase } from "../../database/mongodb";
import { ObjectId } from "mongodb";
import { verifyMessage } from "ethers/lib/utils";
import { getRFP } from "../../web3/serveraccessweb3";
import { IdxDocTypes } from "../.././utils/constants";
import { buildQuery } from "../../database/serverDBUtils";
import { isEmpty } from "../../utils/misc";
import { convUnixEpoch } from "../../utils/misc";
import processBDerror from '../../database/processBDerror'


// methods to save and retrieve a secret file
// our promise: we'll return a string with the error on property msg

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  switch (method) {
    // GET - consult and retrieve secrets for requested file
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
        res.status(200).json({ status: false, msg: result.message });
        break;
      }
      if (
        parseInt(result.RFP.endReceivingDate.toString()) >
        convUnixEpoch(new Date())
      ) {
        // not reached allowed time yet
        res.status(200).json({ status: false, msg: "notimetodownload" });
        break;
      }
      // need to get secrets of requested file to check its docType
      const secretsQuery = buildQuery({ idx: arweaveFileIdx });
      let secrets;
      try {
          secrets = await db
            .collection("secrets")
            .find(secretsQuery)
            .sort({ _id: 1 })
            .limit(20)
            .toArray()
      } catch(error) {
        const {status, message} = processBDerror(error)
        res.status(status).json({ status: false, msg:message })
        break;
      }
      if (!secrets.length >= 1) {
        res.status(403).json({ status: false, msg: "no_secrets" });
        break;
      }
      //checks for confidential file
      if (typeof secrets[0].docType==='undefined') {
          res.status(403).json({ status: false, msg: "no_valid_docType" });
        break;
      }
      if (secrets[0].docType === IdxDocTypes.documentProposalType.toString()) {
        // is confidential, check requisites
        const { signature, msg } = params;
        if (!signature || !msg) {
          res.status(403).json({ status: false, msg: "no_valid_signature" });
          break;
        }
        try {
          var account = verifyMessage(JSON.stringify(msg), signature);
        } catch (error) {
          res.status(403).json({ status: false, msg: "bad_signed_message" });
          break;
        }
        if (result.RFP.issuer.toLowerCase() !== account.toLowerCase()) {
          res
            .status(403).json({ status: false, msg: "only_ownerrfp_doctpye" });
          break;
        }
      }
      // if make it up to here then everything is fine watheaver it's confidential or private, deliver secrets
      res.status(200).json({ status: true, secrets: secrets[0] });
      break;
    case "POST": //  post one secret data to DataBase
      if (isEmpty(req.body)) {
        res.status(403).json({ status: false, msg: "no_data_to_save" });
        return;
      }
      try {
        const fallo= req.body
        // fallo._id= ObjectId('64a5b794fc92303fde59f295')
        const data = await db.collection("secrets").insertOne(req.body);
        // const data = await db.collection("secrets").insertOne(fallo);
        res.status(200).json({ status: true, _id: data.insertedId.toString() });
        break;
      } catch (error) {
        const {status, message} = processBDerror(error)
        res.status(status).json({ status: false, msg:message }) 
        break;
      }
    default:
      res.status(503).json({ status: false, msg:'bad_method' })
      break
  }
}
