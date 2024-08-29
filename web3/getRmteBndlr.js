import { WebBundlr } from "@bundlr-network/client"

export const getRmteBndlr = async () => {
  const result = await fetch('/api/getpresignedhash',{method: 'GET'})

  const data = await result.json()
  const presignedHash = Buffer.from(data.presignedHash,'hex')

  const provider = {
    getSigner: () => {
        return {
            signMessage: () => {
                return presignedHash
            }
        }
    }
  }
  const bundlr = new WebBundlr( 
    process.env.NEXT_PUBLIC_BUNDLR_BUNDLRNETWORK,
    process.env.NEXT_PUBLIC_BUNDLR_CURRENCY, 
    provider
  )
  await bundlr.ready()
  return bundlr
}