import { useState } from 'react'
import { appWithTranslation } from "next-i18next";
import clientPromise from '../database/mongodb'

// WAGMI related imports
import { WagmiConfig, configureChains, createClient, chain } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


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
  ],
  provider,
  webSocketProvider,
})


function MyApp({ Component, pageProps, isConnected,  _nextI18Next  }) {
  // Variables to hold state through all Pro-pon D'app via proponContext context
  const [ companyData, setCompanyData] = useState({})
  




  const setcurrentCompanyData = (companyData={}) => {
    setCompanyData(companyData)
  }

  
  const clearCompany = () => {
    setCompanyData({})
  }  
  return (
   <>
    <proponContext.Provider value={{
          setcurrentCompanyData, 
          clearCompany, 
          companyData
      }}>
        <WagmiConfig client={client}>
            <HeadBar isConnected={isConnected} />
            <Component {...pageProps} />
        </WagmiConfig>
      </proponContext.Provider>
   </>
  )
}
export async function getStaticProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true, _nextI18Next  },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default appWithTranslation(MyApp);
