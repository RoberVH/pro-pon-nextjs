import { useState } from 'react'
import Image  from 'next/image'
import { nanoid } from 'nanoid'

function DisplayItems({items, t}) {
    const [showingItems,setShowingItems] = useState(true)
    return (
    <div className=" my-2 w-2/6 font-khula mx-8  bg-white leading-8 shadow-md "> 
        <div className="flex justify-between">
            <div className="flex pl-2 py-1 px-4">
                <Image alt="Proposal" src="/surveys-icon.svg" height={17} width={17} 
                className="text-orange-400 mt-1 ml-2" />  
                <p className="font-khula ml-4 mt-1 text-md text-stone-900">{t('showItems')}</p>
            </div>
            <div className="mt-3 mr-4">
                <Image  
                    onClick = {() => setShowingItems(!showingItems)}
                    alt="V" src={'/chevrondown.svg'} width={22} height={22}></Image>
            </div>
        </div>
        <div className="my-4 px-4 pb-6">
            { showingItems && 
                <ul>
                    { items.map(item => 
                        <li key={nanoid()} className="truncate border-b border-b-2 border-orange-400">
                            <label className="px-4 w-1/6 "> {item} 
                            </label>
                        </li>
                        )
                    }
                </ul>
            }
        </div>
    </div>)
}

export default DisplayItems