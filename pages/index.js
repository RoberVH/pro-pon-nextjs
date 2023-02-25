import { useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { proponContext } from "../utils/pro-poncontext";
import Spinner from "../components/layouts/Spinner";


import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { companyData, address, showSpinner } = useContext(proponContext);
  const { locale } = useRouter();
  const { t } = useTranslation();

  return (
    <main className="antialiased ">
      {showSpinner && (
        <div className="absolute bottom-[45%] left-[45%]">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="mt-8 text-4xl font-bold font-khula text-slate-500 ">
          <h1> {t("aptitle")}</h1>
        </div>
        <div className="mt-4 w-[45%] p-4  rounded-xl   h-[80px]">
          <p className="pt-2 font-khula font-semibold  text-orange-500 text-md text-xl text-center">
            {t("explanation1")}
          </p>
        </div>
        {!companyData.companyname && address ? (
          <div
            id="signupframe"
            className=" w-full  flex justify-center bg-slate-200  py-8 "
          >
            <div
              id="calltosignupsubframe"
              className="p-8 w-[55%] bg-orange-200 flex flex-row justify-center 
          rounded-xl  border-2 border-red-600"
            >
              <div>
                <p className="uppercase text-center font-nunito text-md font-bold text-orange-800 leading-8">
                  {t("instructions_title")}
                </p>
                <ul className="list-decimal ml-4 mt-8 font-nunito text-md font-bold text-orange-800 leading-8">
                  {t("instructions", { returnObjects: true }).map((ins) => (
                    <li key={ins}>{ins}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-16">
                <Link href="/signup" passHref>
                  <a
                    className=" ml-16 p-4 font-khula font-black text-xl uppercase 
                    text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                    bg-gradient-to-r from-orange-500  to-blue-500 
                    bg-gradient-x 1s ease infinite
                    hover:outline hover:outline-4 hover:outline-orange-300
                    hover:outline-offset-2"
                  >
                    {t("signup", { ns: "common" })}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-full mt-12 py-4  bg-gradient-to-r from-orange-300 via-slate-200 to-orange-300 ">
          <div className="mx-16 p-4 pr-24  ">
            <div className="mx-16 float-left pr-8">
              <Image
                alt="Logo"
                src="/candado.jpg"
                width={400}
                height={300}
                layout="fixed"
              ></Image>
            </div>
            <ul className="list-disc ml-4 mt-14  text-md text-slate-900 leading-8 font-nunito">
              {t("benefits", { returnObjects: true }).map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full py-16  bg-gradient-to-r from-blue-300 via-orange-200 to-blue-300">
        <div className="font-khula text-stone-800  grid grid-cols-2 grid-gap-16">
          <div className="pl-64">
            <ul>
              <li> ‣ &nbsp; Each Document is signed with a Crypto Account</li>
              <li> ‣ &nbsp; All history is store at Blockchain</li>
              <li> ‣ &nbsp; All history is store at Blockchain</li>
              <li> ‣ &nbsp; All history is store at Blockchain</li>
            </ul>
          </div>
          <div className="pl-32">
            <ul>
              <li> ‣ &nbsp; Get Quotes from all the world</li>
              <li> ‣ &nbsp; Obtain better prices</li>
              <li>
                {" "}
                ‣ &nbsp; A story of past performance is trackable giving you
                certainty on providers
              </li>
              <li> ‣ &nbsp; As a provider you will show you are trustable</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-96 bg-stone-500 text-center text-blue-800 mt-4">
        <div className="grid grid-cols-2 gap-4 text-stone-200 font-khula text-2xl">
          <div className="mt-16">
            <div className="flex pt-16 pl-40">
              <Image
                alt="logo"
                src="/pro-ponLogo.png"
                width={65}
                height={20}
              ></Image>
              <h1
                className="ml-2 mt-4 mb-4 bg-gradient-to-r from-[#084da1] to-[#d93f0b] 
              text-transparent bg-clip-text text-3xl font-extrabold cursor-pointer"
              >
                ᑭᖇO-ᑭOᑎ <strong className="text-4xl">!</strong>
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="leading-12 pt-8 pr-8 text-start">
              <p className="text-3xl pb-8">
                <strong>Porqué Pro-pon</strong>
              </p>
              <Link href="/" passHref className="mt-8">
                <p className="cursor-pointer">Legal</p>
              </Link>
              <Link href="/" passHref className="mt-4">
                <p className="cursor-pointer">Documentos</p>
              </Link>
            </div>
            <div className="leading-12 pt-8 pr-8 text-start">
              <p className="text-3xl pb-8">
                <strong>Como usarlo </strong>
              </p>
              <Link href="/" passHref className="mt-8">
                <p className="cursor-pointer">Guia</p>
              </Link>
              <Link href="/" passHref className="mt-4">
                <p className="cursor-pointer">Videos</p>
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-24 text-stone-200"> @RoberVH | rovicher.eth</p>
        <p className=" text-stone-200">August 2022</p>
      </div>
    </main>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "menus"])),
    },
  };
}
