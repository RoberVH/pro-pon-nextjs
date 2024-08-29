// API route serversigning
// sign transacction with server's mumbai account

import Bundlr from "@bundlr-network/client/";
import { sortWeb3Error } from "../../utils/sortWeb3Error";


export default async function handler(req, res) {
  
  // get the bundler instance from the key we use at the server
  const serverBundlr = new Bundlr(
    process.env.NEXT_PUBLIC_BUNDLR_BUNDLRNETWORK,
    process.env.NEXT_PUBLIC_BUNDLR_CURRENCY,
    process.env.BUNDLR_POLYGON_PVK_ACCOUNT
  )  
  const clientData= Buffer.from(req.body.datatosign,'hex')
  
  try {  
    const signedData = await serverBundlr.currencyConfig.sign(clientData) 
    const signedDataEncoded = Buffer.from (signedData)
    res.status(200).json({ status:true,signeddata:signedDataEncoded })
  } catch (error) {
    const msgErr=sortWeb3Error(error)
    res.status(405).json({status:false, message:msgErr})
  }
}