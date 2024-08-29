/**
 * Guides
 *      Page to interact wuth an RPF
 *   @param {object} query - HomeRFP receive from URL a string of params that gets converted
 *                          to an object on query
 *      HomeRFP display RFPessentialData to show data from RFP at left panel of UI
 *      On rigth panel it shows RFPTabDisplayer that portraits tabs with different functionalities
 *      Each Tab host a component to present the required functionality
 */

import { useRouter } from "next/router";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Image from 'next/image'

function Guides() {
  const { t } = useTranslation("guides");
  const router = useRouter();

  const guidePoints = [
    {
      title: t("install_crypto_wallet"),
      description: t("install_crypto_wallet_desc"),
      slug: "installcryptowallet",
    },
    {
      title: t("securely_store_seed_phrase"),
      description: t("securely_store_seed_phrase_desc"),
      slug: "securely-store-seed-phrase",
    },
    {
      title: t("set_metamask_account_name"),
      description: t("set_metamask_account_name_desc"),
      slug: "set-metamask-account-name",
    },
    {
      title: t("point_wallet_to_polygon"),
      description: t("point_wallet_to_polygon_desc"),
      slug: "point-wallet-to-polygon",
    },
    {
      title: t("get_crypto_from_exchanges"),
      description: t("get_crypto_from_exchanges_desc"),
      slug: "get-crypto-from-exchanges",
    },
    {
      title: t("send_and_receive_crypto"),
      description: t("send_and_receive_crypto_desc"),
      slug: "send-and-receive-crypto",
    },
    {
      title: t("create_dapp_account"),
      description: t("create_dapp_account_desc"),
      slug: "create-dapp-account",
    },
    {
      title: t("create_rfp"),
      description: t("create_rfp_desc"),
      slug: "create-rfp",
    },
    {
      title: t("search_rfps"),
      description: t("search_rfps_desc"),
      slug: "search-rfps",
    },
    {
      title: t("bid_to_rfp"),
      description: t("bid_to_rfp_desc"),
      slug: "bid-to-rfp",
    },
  ];



  return (
    <div>
      <div className="">
        <div className="max-w-[80%] mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {t("guides_title")}
          </h1>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guidePoints.map((point) => (
            <li key={point.slug} className="col-span-1 bg-white shadow-lg rounded-lg border-2 border-blue-900">
                <a href={`/guides/${point.slug}`} target="_blank" rel="noopener noreferrer" className="block my-4 p-6">
                    <div className="relative h-40">
                    <Image
                        src="/guide-2.jpg"
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg "
                    />
                    </div>
                    <h3 className="text-xl text-stone-900 italic font-bold mt-4 mb-2">{point.title}</h3>
                </a>
            </li>
            ))}
        </ul>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["guides"])),
    },
  };
}

export default Guides;
