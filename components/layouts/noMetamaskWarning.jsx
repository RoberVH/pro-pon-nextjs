import Link from 'next/link'

const NoMetamaskWarning= ({t}) => (
    <div className="font-bold text-orange-300 font-khula flex justify-center pt-2 pb-6">
        <h1 className="text-xl mt-2">{t('metamaskwarning',{ns:"common"})}</h1>
        <Link href={"https://metamask.io/download/"} passHref>
            <a className="ml-8 p-2 font-khula font-black text-sm uppercase 
                    text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                    bg-gradient-to-r from-orange-500  to-red-500 
                    hover:outline hover:outline-2 hover:outline-orange-300
                    hover:outline-offset-2" 
                    target="_blank"
                    rel="noreferrer"
                    >
                Get Metamask
            </a>
        </Link>
    </div>
)
export default NoMetamaskWarning