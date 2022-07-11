import { useState } from 'react'
import { appWithTranslation } from "next-i18next";
// WAGMI imports
import { WagmiConfig, configureChains, createClient, chain } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// Pro-pon components
import { proponContext } from '../utils/pro-poncontext'
import HeadBar from '../components/layouts/HeadBar'
import '../styles/globals.css'

//WAGMI configuration 
// Dev Mumbai Network
const alchemyId = process.env.ALCHEMY_ID_DEV
// Prod Polygon Network
//const alchemyId = process.env.ALCHEMY_ID


/** Chains to use with wagmi  mumbai for DEV and polygon for PROD*/
// DEV: chain.polygonMumbai
//PROD: chain.polygon
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ alchemyId }), publicProvider()],
)
// Wagmi Client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})


function MyApp({ Component, pageProps }) {
  // Variables to hold state through all Pro-pon D'app via proponContext context
  const [companyName, setCompanyName] = useState('')
  const [ companyId, setCompanyId] = useState('')

  const setcurrentCompanyData = (companyName, companyId) => {
    setCompanyName(companyName)
    setCompanyId(companyId)
  }
  
  const clearCompany = () => {
    setCompanyName('')
    setCompanyId('')
  }  
  return (
   <>
    <proponContext.Provider value={{
          setcurrentCompanyData, 
          clearCompany, 
          companyName, 
          companyId
      }}>
        <WagmiConfig client={client}>
            <HeadBar />
            <Component {...pageProps} />
        </WagmiConfig>
      </proponContext.Provider>
   </>
  )
}

export default appWithTranslation(MyApp);
