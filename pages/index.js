import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";


export default function Home() {
  const { locale } = useRouter();
  const { t } = useTranslation('home');
  return (
  <main className="flex justify-center text-2xl">
    <p>{t('greetings')}</p>
  </main>)
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menus'])),
      // Will be passed to the page component as props
    },
  }}