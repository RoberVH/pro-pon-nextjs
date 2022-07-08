import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";
import Image from 'next/image'


export default function Home() {

  const { locale } = useRouter();
  const { t } = useTranslation();
  return (
  <main className=" antialiased">
    <div className="flex flex-col items-center"> 
      <div className="mt-16 text-4xl font-bold font-khula text-slate-900 ">
        <h1> {t('aptitle')}</h1>
      </div>
      <div className="mt-4 w-[45%] p-4 bg-white rounded-xl  shadow-lg h-[80px]">
        <p className="font-khula font-semibold  text-md text-xl">{t('explanation1')}</p>
      </div>
      <div className="w-full mt-12 bg-orange-100 py-4">
          <div className="mx-16 p-4 pr-24  ">
            <div className="mx-16 float-left pr-8">
            <Image  alt='Logo' src='/candado.jpg' 
                 width={450} height={350} layout='fixed'
                >
            </Image>
            </div>
            <p className="mt-16  text-xl text-slate-700 leading-8 font-nunito">
              <ul className="list-disc ml-4">
                {
                t('benefits', { returnObjects: true }).map((benefit)=> <li key={benefit}>{benefit}</li>)
                }
              </ul>
            </p>
          </div>
      </div>
      <div className=" w-full flex flex-row justify-center bg-blue-200 p-8 mb-16">
        <div>
        <p className="uppercase text-center font-nunito text-xl font-bold text-orange-800 leading-8">
          {t('instructionstitle')}
        </p>      
        <p className="mt-8 font-nunito text-lg font-bold text-orange-800 leading-8">
              <ul className="list-decimal ml-4">
                {
                t('instructions', { returnObjects: true }).map((ins)=> <li key={ins}>{ins}</li>)
                }
              </ul>
            </p>
        </div>
        <div>
          <button  className="mt-16 ml-16 p-4 font-khula font-black text-xl uppercase text-white bg-orange-600
              rounded-xl  drop-shadow-lg  hover:bg-slate-700">
              {t('connectwallet')}
          </button>
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