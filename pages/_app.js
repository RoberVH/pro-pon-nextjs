import { appWithTranslation } from "next-i18next";
import HeadBar from '../components/HeadBar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HeadBar />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp);
