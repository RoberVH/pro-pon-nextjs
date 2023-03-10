import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from "next-i18next"
import  MenuHolder  from './layouts/menuHolder'

const companyOptions = [
  {tag:'companiessearch', link:'/companies'},
  {tag:'myrfps', link:'/myrfps'}
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
    <div className='flex mt-12 ml-20' >
      <div className="text-white text-md font-medium font-khula uppercase flex items-start mr-8">
          <label 
              onClick={()=> handleMenu('company')}  
              className=" cursor-pointer  decoration-orange-200 hover:text-slate-300
                        duration-300 hover:underline underline-offset-8 hover:transition-opacity  ">
            &nbsp;{t('companies')}&nbsp;
          </label>
          {
            menuCompany &&
            <MenuHolder options={companyOptions} t={t} setMenuFlag={setMenuCompany} />
          }
      </div>
      <div className="text-white text-md font-medium font-khula uppercase flex items-start">
          <label 
              onClick={()=> handleMenu('rfp')} 
              className="cursor-pointer  decoration-orange-200 hover:text-slate-300
              duration-300 hover:underline underline-offset-8 hover:transition-opacity">
                &nbsp;{t('rfps')}&nbsp;
          </label>
          {
            menuRFP && 
            <MenuHolder options={rfpOptions} t={t} setMenuFlag={setMenuRFP} />
          }
       </div>
    </div>
  )
}

export default Menues

