import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from "next-i18next"
import  MenuHolder  from './layouts/menuHolder'

const rfpOptions = [
  {tag:'rfpcreate', link:'/createrfps'},
  {tag:'rfpsearch', link:'/searchrfps'}
  ]          


function Menues() {
  const [menuRFP, setMenuRFP] = useState(false)

  const { t } = useTranslation('menus');

  const handleRFPs = () => {
    setMenuRFP(!menuRFP)
  }
  return (
    <div className="text-white text-md font-extrabold font-khula flex uppercase mt-12 ml-20 ">
        <Link href="/companies" passHref >
            <label className="mr-8 cursor-pointer  decoration-orange-200 hover:text-slate-300
             duration-300 hover:underline underline-offset-8 hover:transition-opacity  ">
              &nbsp;{t('companies')}&nbsp;
            </label>
        </Link>
        <p>
        <label onClick={handleRFPs} className="ml-8 cursor-pointer hover:underline  hover:text-slate-300 duration-300
        decoration-orange-200 underline-offset-8">&nbsp;{t('rfps')}&nbsp;</label>
        </p>      
        {
          menuRFP && 
          <MenuHolder options={rfpOptions} t={t} setMenuFlag={setMenuRFP}/>
        }
    </div>
  )
}

export default Menues

