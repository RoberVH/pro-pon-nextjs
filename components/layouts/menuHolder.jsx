import { useRouter } from "next/router";

function MenuHolder({options, t, setMenuFlag}) {
    const router = useRouter()


    const handleMenuClick = (e) => {
        setMenuFlag(false)
        router.push(e.target.id)
    }
    return (
    <div className="absolute mt-8">
        <div id='menuHolder' 
             className="flex flex-col bg-slate-200  rounded-2xl text-stone-600 justify-start py-4 px-2">
            {   
              options.map(menu => 
                <p key={menu.tag} 
                className="pt-2 text-sm hover:cursor-pointer hover:bg-stone-100" 
                onClick={handleMenuClick} id={menu.link}>
                    {t(menu.tag)} 
                </p>
                )
            }
       </div>
    </div>
  )
}

export default MenuHolder