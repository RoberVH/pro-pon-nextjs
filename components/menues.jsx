import Link from 'next/link'
import { useTranslation } from "next-i18next"



function Menues() {
  

  const { t } = useTranslation('menus');

  return (
    <div className="text-white text-xl font-extrabold font-khula   uppercase mt-12 ml-16 ">
        <Link href="/companies" passHref >
            <label className="mr-8 cursor-pointer  decoration-orange-200 hover:text-slate-300
             duration-300 hover:underline underline-offset-8 hover:transition-opacity  ">
              &nbsp;{t('companies')}&nbsp;
            </label>
        </Link>

        <Link href="/rfps" passHref>
        <label className="ml-8 cursor-pointer hover:underline  hover:text-slate-300 duration-300
        decoration-orange-200 underline-offset-8">&nbsp;{t('rfps')}&nbsp;</label>
        </Link>                
    </div>
  )
}

export default Menues

