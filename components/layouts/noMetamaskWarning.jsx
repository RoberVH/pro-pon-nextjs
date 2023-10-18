import Link from 'next/link'

const NoMetamaskWarning= ({msg, buttontitle}) => (
    <div className="font-bold text-white font-khula flex justify-center items-center mx-6">
        <h1 className="text-md  ">{msg}</h1>
        <Link href={"https://metamask.io/download/"} passHref >
            <a className="ml-8 p-2 font-khula font-black text-sm 
                    text-white  rounded-xl    
                    bg-gradient-to-r from-orange-500  to-red-500 
                    hover:outline hover:outline-2 hover:outline-orange-300
                    hover:outline-offset-2 " 
                    target="_blank"
                    rel="noreferrer"
                    >
                {buttontitle}
            </a>
        </Link>
    </div>
)
export default NoMetamaskWarning