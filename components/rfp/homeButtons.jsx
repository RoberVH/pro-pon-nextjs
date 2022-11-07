import React from 'react'
function HomeButtons({t, displayedPanels, selectedPanel, setSelectedPanel}) {
  return (
    <ul className="flex justify-start ">
        {displayedPanels.map(selector => 
        <li key={selector}> 
           <button  
                id={selector}
                onClick={(e)=>{setSelectedPanel(e.currentTarget.id)}}
                //onClick={(e)=>{handlechange(e)}}
                className={`mr-2 py-1 px-4 leading-2 text-sm  font-bold uppercase rounded-tr-3xl rounded-tl-md
                hover:bg-orange-300  bg-white border-2 border-orange-300
                ${selector===selectedPanel?'bg-orange-500 text-white pointer-events-none'
                :'bg-white border-l-orange-300 text-orange-500  '}`}>
                    <label><strong>{t(selector)}</strong></label>
            </button>
        </li>)
        }
    </ul>
  )
}

export default HomeButtons