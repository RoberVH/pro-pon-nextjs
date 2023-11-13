import Link from "next/link";

const NoMetamaskWarning = ({ msg, buttontitle }) => (
  <div className=" text-white font-work-sans flex justify-center items-center mx-6 ">
    <p className="text-components  ">{msg}</p>
    <Link href={"https://metamask.io/download/"} passHref>
      <a
        className="ml-8 p-2 font-work-sans  text-components
                    text-white  rounded-xl  text-center  
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
);
export default NoMetamaskWarning;
