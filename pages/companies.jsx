import React from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router";

function Companies() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  return (
    <div>{t('companies')}</div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menus'])),
      // Will be passed to the page component as props
    },
  }}

export default Companies