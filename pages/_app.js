import { useState } from 'react'
import { appWithTranslation } from "next-i18next";
import clientPromise from '../database/mongodb'

// Pro-pon components
import { proponContext } from '../utils/pro-poncontext'
import HeadBar from '../components/layouts/HeadBar'
import '../styles/globals.css'


function MyApp({ Component, pageProps, isConnected,  _nextI18Next  }) {
  // Variables to hold state through all Pro-pon D'app via proponContext context
  const [ companyData, setCompanyData] = useState({})
  const [ address, setAddress] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [noRightNetwork, setNoRightNetwork] = useState(false);
  
  return (
   <>
    <proponContext.Provider value={{
        companyData,
        setCompanyData, 
        address, 
        setAddress,
        showSpinner, 
        setShowSpinner,
        noRightNetwork, 
        setNoRightNetwork
      }}>
        <div className={`${showSpinner ? 'opacity-50 cursor-not-allowed':null}`}>
          <HeadBar isConnected={isConnected} />
          <Component {...pageProps} />
        </div>
      </proponContext.Provider>
   </>
  )
  
}
export async function getStaticProps(context) {
  try {
    await clientPromise
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
