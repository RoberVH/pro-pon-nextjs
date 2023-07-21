import { useState } from 'react'
import Image from 'next/image'

const sizeIcon = 22
function CtlPagination({
    currentPage,
    setCurrentPage,
    numberPages,
    t
    }) {

    function navArrow (actionFunction, iconPath, title) {
    return (
    <span className="" title={t(title,{ns:"common"})}>
      <Image 
        onClick={actionFunction}  
        alt="navigation Arrow" 
        className="cursor-pointer" src={iconPath} width={sizeIcon} height={sizeIcon}>
      </Image>
    </span>
    )}

    const handleFirstPag = () => {
       setCurrentPage(1)
    }

    const handleDownPag = () => {
      if (currentPage - 1 >= 1)  setCurrentPage(prev => prev - 1)
    }

    const handleUpPag = () => {
      if (currentPage + 1 <= numberPages) setCurrentPage(prev => prev + 1)
    }

    const handleLastPag = () => {
      setCurrentPage(numberPages)
   }

    return (
    <div id="ctlPagination" className=" h-24 flex justify-center items-center">
     <div className="p-2 flex bg-stone-300 rounded-lg">
        {navArrow(handleFirstPag, '/first_page_black_24dp.svg','first_page')}
        {navArrow(handleDownPag, '/keyboard_double_arrow_left_black_24dp.svg','down_one_page')}
        <p className="text-md mx-16">{`${currentPage} / ${numberPages} `} </p>
        {navArrow(handleUpPag, '/keyboard_double_arrow_right_black_24dp.svg','up_one_page')}
        {navArrow(handleLastPag, '/last_page_black_24dp.svg','last_page')}
     </div>
     
    </div>
  )
}

export default CtlPagination

