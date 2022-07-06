import React from 'react'
import Link from 'next/link'
import { useTranslation } from "next-i18next"


function Menues() {
  const { t } = useTranslation('menus');
  return (
    <div className="text-xl font-semibold text-slate-100  uppercase mt-12 ml-16 ">
        <Link href="/companies"  >
            <label className="mr-8 cursor-pointer decoration-orange-200 hover:text-slate-300 duration-300
            hover:underline underline-offset-8 hover:transition-opacity  ">&nbsp;'companies'&nbsp;</label>
        </Link>

        <Link href="/rfps">
        <label className="ml-8 cursor-pointer hover:underline  hover:text-slate-300 duration-300
        decoration-orange-200 underline-offset-8">&nbsp;'rfps'&nbsp;</label>
        </Link>                
    </div>
  )
}

export default Menues

