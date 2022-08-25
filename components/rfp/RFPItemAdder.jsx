import { useState } from 'react'

function RFPItemAdder({items, setItems}) {
  const [itemTender, setItemTender] = useState('')      // local state var to control the current Item being added to prop items

  const handleRemoveItem = (itemToRemove) => {
    console.log('ItemToRemove',itemToRemove)
    setItems(items.filter(item=> item!== itemToRemove))
  }

  // Add the local item to prop items  via setItems prop method
  const handleAddItem = () => {
    setItems(items => [...items, itemTender])
    setItemTender('')
  }
 console.log('RFPItemAdder', items)
  return (
    <div className="text-coal-200">
        <p className="text-stone-600 font-khula "> Optional: Add an Item to be granted if you have several items described on your RFP/Tender</p>
        <input 
            className="w-[80%] p-2 mt-12 mr-4 outline outline-1 outline-orange-600  rounded-md"
            type = 'text'
            id='addItemInputControl'
            onChange = { (e) => setItemTender(e.currentTarget.value) }
            value={itemTender}
            placeHolder= {'Nombre de Partida'}
        />
        <button 
            disabled={(itemTender.length===0)}
            className="btn-add-circular disabled:cursor-not-allowed"
            onClick={handleAddItem}>
                +
        </button>
        <ul className="pt-4 pl-2 text-stone-500 list-disc">
                {items.length>0 && items.map((item, indx) =>
                    <li key={indx} className="flex p-2  ">
                        <p className="truncate w-[80%] mr-6 border-b-2 border-orange-200">{item}</p>
                        <button 
                        className="btn-remove-circular mt-1 "
                        onClick={() => handleRemoveItem(item)}>
                            -
                        </button>
                    </li>)
                }
        </ul>
    </div>
  )
}

export default RFPItemAdder