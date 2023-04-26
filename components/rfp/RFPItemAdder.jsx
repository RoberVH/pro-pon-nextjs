import { useState } from 'react'
import { useTranslation } from "next-i18next";
import { customAlphabet } from 'nanoid'
// import { toastStyle } from "../../styles/toastStyle";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function RFPItemAdder({items, setItems, showItemsField, disable}) {
  const [itemTender, setItemTender] = useState('')      // local state var to control the current Item being added to prop items
  //const [editionLine, setEditionLine] = useState('')
  //const [editingIndexLine, seteditingIndexLine] = useState(-1)
  //const [editingLine, setEditingLine] = useState(false)
  const { t } = useTranslation("rfps");
  const nanoid = customAlphabet('abcdefghijklmnnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)


const handleKeyPress= (e) => {
  if ((e.key === "Enter" || e.key === "NumpadEnter") && itemTender) {
    e.preventDefault()  
    handleAddItem()
    }
}

  // look items[index] and substitute it for e.currentTarget.value
  const handleChangeItemLine = (e, index) => {
   // setItems((items) => items.filter(elem => index))
   setItems(item => ({ ...items, [e.target.id]: e.target.value }));
  }

  const handleRemoveItem = (key) => {
    setItems(items => {
          const rest = {...items}
          delete rest[key]
          return rest
        })
  }
  
  const handleRemoveAllItems = () => {
    //add here a warning confirmation to remove all items!
    setItems({})
  }

  // Add the local item to prop items  via setItems prop method
  const handleAddItem = () => {
    const idx=nanoid()
    setItems(items => ({...items, [idx]:itemTender}))
    setItemTender('')
  }

 if (!showItemsField) return null
  return (
    <div className="">
          <div className="">
            <p className="text-stone-500">{t('additemstitle')}  </p>
            <p className="text-stone-500">{t('addintemsinstructions')}</p>
            <div className=" flex mt-10">
              <input 
                  className="w-[80%] p-2  mr-4 outline outline-1 outline-orange-600  rounded-md"
                  type = 'text'
                  id='addItemInputControl'
                  onChange = { (e) => setItemTender(e.target.value) }
                  onKeyPress = {handleKeyPress}
                  value={itemTender}
                  placeholder= {t('itemplaceholder')}
                  disabled={disable}
              />
              <button 
                    disabled={((itemTender.length===0) || disable)}
                    className="btn-add-circular disabled:cursor-not-allowed"
                    onClick={handleAddItem}>
                        +
              </button>
              <button 
                  disabled={(!Object.keys(items).length || disable)}
                  className="btn-removeall-circular disabled:cursor-not-allowed ml-1
                  group relative inline-block  "
                  onClick={handleRemoveAllItems}> 
                      x
                      <span className="tooltip-span-rigth mt-2">
                          {t('removeallitems')}
                      </span>
              </button>
            </div>
            <div className="mt-4  border border-1 border-orange-400  h-[36vh] w-[34vw]  overflow-y-auto">
              <ul className="pt-6 pl-2 text-stone-500 list-disc">
                      { Object.keys(items).map((itemKey) =>
                          <li key={itemKey} className="flex p-2">
                            <input 
                              id={itemKey}
                              type='text'
                              className={`truncate w-[80%] mr-6 border-b-2 border-orange-200 focus:bg-stone-200 focus:outline-none`}
                              onChange={(e) => handleChangeItemLine(e,itemKey)}
                              value={items[itemKey]}
                              disabled={disable}>
                            </input>
                            <button 
                              className="btn-remove-circular mt-1 ml-1 group relative inline-block "
                              onClick={() => handleRemoveItem(itemKey)}
                              disabled={disable}>
                                  - 
                                <span className="tooltip-span-top -left-20">
                                {t('removethisitem')}
                                </span>
                            </button>
                          </li>
                          )
                      }
              </ul>
            </div>
          </div> 
    </div>
  )
}

export default RFPItemAdder