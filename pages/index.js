import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";
import Image from 'next/image'
import Link from 'next/link'


export default function Home() {

  const { locale } = useRouter()
  const { t } = useTranslation()
  return (
  <main className=" antialiased">
    <div className="flex flex-col items-center"> 
      <div className="mt-8 text-4xl font-bold font-khula text-slate-500 ">
        <h1> {t('aptitle')}</h1>
      </div>
      <div className="mt-4 w-[45%] p-4  rounded-xl   h-[80px]">
        <p className="pt-2 font-khula font-semibold  text-orange-500 text-md text-xl text-center">
          {t('explanation1')}
        </p>
      </div>
      <div className="w-full mt-12 py-4  bg-gradient-to-r from-orange-300 via-slate-200 to-orange-300 ">
          <div className="mx-16 p-4 pr-24  ">
            <div className="mx-16 float-left pr-8">
            <Image  alt='Logo' src='/candado.jpg' 
                 width={400} height={300} layout='fixed'
                >
            </Image>
            </div>
            <ul className="list-disc ml-4 mt-14  text-md text-slate-900 leading-8 font-nunito">
              {
              t('benefits', { returnObjects: true }).map((benefit)=> <li key={benefit}>{benefit}</li>)
              }
            </ul>
          </div>
      </div>
      <div className=" w-full flex flex-row justify-center bg-blue-200 p-8 mb-16">
        <div>
        <p className="uppercase text-center font-nunito text-md font-bold text-orange-800 leading-8">
          {t('instructions_title')}
        </p>      
        <ul className="list-decimal ml-4 mt-8 font-nunito text-md font-bold text-orange-800 leading-8">
          {
          t('instructions', { returnObjects: true }).map((ins)=> <li key={ins}>{ins}</li>)
          }
        </ul>
        </div>
        <div className="mt-16">
          <Link href="/signup" passHref>
            <a  className=" ml-16 p-4 font-khula font-black text-xl uppercase 
                text-white bg-orange-600 rounded-xl  drop-shadow-lg  
                bg-gradient-to-r from-orange-500  to-blue-500 
                hover:border-2 hover:shadow-md 
                hover:bg-stone-600
                active:ring-4  
                bg-gradient-x 1s ease infinite">
                {t('connect_wallet')}
            </a>
          </Link>
        </div>
      </div>
    </div>
      <div className="text-center text-blue-800">
      <p > @RoberVH | rovicher.eth</p>
      <p className="mb-4">August 2022</p>
    </div>
  </main>)
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menus'])),
    },
  }}