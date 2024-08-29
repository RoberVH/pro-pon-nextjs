import Image from "next/image"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"

function Installcryptowallet() {
  const { t } = useTranslation("guides")
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-work-sans">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{t("install_wallet_title")}</h1>
        <p className="text-gray-900">{t("install_wallet_description")}</p>
      </div>
      <div className="max-w-lg mx-auto">
        <Image
          src="/guide-2.jpg" // Replace with your actual image source
          alt="Guide Image"
          width={800}
          height={500}
          className="rounded-lg"
        />
      </div>
      <div className="mt-8 text-stone-800 "></div>
    </div>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["guides"])),
    },
  }
}

export default Installcryptowallet
