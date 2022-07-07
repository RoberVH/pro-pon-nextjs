import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";


export default function Home() {

  const { locale } = useRouter();
  const { t } = useTranslation();
  const benef = t('benefits', { returnObjects: true })
  //const b2=JSON.stringify(JSON.parse(benef))
  console.log('benef', benef)
  return (
  <main className=" antialiased">
    <div className="flex flex-col items-center"> 
      <div className="mt-16 text-4xl font-bold font-khula text-slate-900 ">
        <h1> {t('aptitle')}</h1>
      </div>
      
      <div className="mt-8 w-[45%] p-4 bg-white rounded-xl  shadow-lg">
        <p className="font-semibold  text-md">{t('explanation1')}</p>
      </div>
      <div className="flex justify-around mt-16">
          <div className="p-4 mr-16 bg-orange-200  border rounded-xl shadow-lg ">
            <p className=" text-md">
              <ul className="list-disc ml-4">
                {
                t('benefits', { returnObjects: true }).map((benefit)=> <li key={benefit}>{benefit}</li>)
                }
              </ul>
            </p>
          </div>
          <div>
          <div className="p-4 ml-16 bg-orange-200  border rounded-xl shadow-lg ">
            <p className=" text-md">
              <ul className="list-disc ml-4">
                {
                t('benefits', { returnObjects: true }).map((benefit)=> <li key={benefit}>{benefit}</li>)
                }
              </ul>
            </p>
          </div>
          </div>
      </div>

      <button  className="mt-12 p-4 font-khula font-black text-xl uppercase text-white bg-orange-600
           rounded-xl  shadow-lg  hover:bg-slate-700">
      {t('connectwallet')}
      </button>

    </div>
  </main>)
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menus'])),
    },
  }}