/**
 * /api/preseignedhash
 *   Get the presigned hash of hardcode message throguh current server account and send it to client 
*/
import Bundlr from "@bundlr-network/client/";

const signingMsj="sign this message to connect to Bundlr.Network"

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            // get the bundler instance from the key we use at the server
            const serverBundlr = new Bundlr(
                    process.env.NEXT_PUBLIC_BUNDLR_BUNDLRNETWORK,
                    process.env.NEXT_PUBLIC_BUNDLR_CURRENCY,
                    process.env.BUNDLR_POLYGON_PVK_ACCOUNT
            )
            await serverBundlr.ready()
            const presignedHash = Buffer.from(await serverBundlr
                                    .currencyConfig.sign(signingMsj)).toString("hex");
            res.status(200).send( {presignedHash} )
            break    
        default:
        res.status(404).send( {message:'Method not supported'} )
        }
}