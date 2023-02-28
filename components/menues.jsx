import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from "next-i18next"
import  MenuHolder  from './layouts/menuHolder'

const companyOptions = [
  {tag:'rfpsearch', link:'/companies'},
  {tag:'my rfps', link:'/myrfps'}
]
const rfpOptions = [
  {tag:'rfpcreate', link:'/createrfps'},
  {tag:'rfpsearch', link:'/searchrfps'}
  ]          


function Menues() {
  const [menuRFP, setMenuRFP] = useState(false)
  const [menuCompany, setMenuCompany] = useState(false)

  const { t } = useTranslation('menus');
  
  const handleMenu = (option) => {
    console.log(option)
    setMenuCompany(option==='company')
    setMenuRFP(option==='rfp')
  }

  return (
    <div 
      onClick={()=> handleMenu('company')} 
      className="text-white text-md font-medium font-khula flex uppercase mt-12 ml-20 ">
        <label className="mr-8 cursor-pointer  decoration-orange-200 hover:text-slate-300
          duration-300 hover:underline underline-offset-8 hover:transition-opacity  ">
          &nbsp;{t('companies')}&nbsp;
        </label>
        {
          menuCompany &&
          <MenuHolder options={companyOptions} t={t} setMenuFlag={setMenuCompany}/>
        }
        <p>
        <label 
            onClick={()=> handleMenu('rfp')} 
            className="ml-8 cursor-pointer hover:underline  hover:text-slate-300 duration-300
            decoration-orange-200 underline-offset-8">&nbsp;{t('rfps')}&nbsp;
        </label>
        </p>      
        {
          menuRFP && 
          <MenuHolder options={rfpOptions} t={t} setMenuFlag={setMenuRFP}/>
        }
    </div>
  )
}

export default Menues

