import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/router";
import Image from 'next/image'


function SelectLanguage() {
  const router = useRouter();
  const [language, setLanguage]=useState('es')
  const [iconLang, setIconLang]=useState('/uk.svg')
  const [hideButtons, setHideButtons] = useState(false)

  const { locale}=router

  const setLocale= useCallback (()=> {
    console.log('Locale=', locale)
    setLanguage(locale)
    switch (locale) {
      case 'en': setIconLang('/uk.svg'); break
      case 'es': setIconLang('/spain.svg'); break
      case 'fr': setIconLang('/france.svg'); break
      default: setIconLang('/uk.svg'); break
    }
  },[locale]);

  useEffect(()=>{
    setLocale()
  },[])

  const handleDropDown = (event) => {
    setHideButtons(!hideButtons)
  }

  const handleLocaleChange = (event) => {
    console.log('X',event.currentTarget.id)
    setLanguage(event.currentTarget.id)
    setIconLang(event.currentTarget.value)
    setHideButtons(false)
    router.push(router.route, router.asPath, {locale: event.currentTarget.id})
  };

  const LanguageButton = ({language, iconLang}) => 
    <button 
        className="p-2"
        onClick = {handleLocaleChange}
        id= {language}
        value={iconLang}>
      <Image alt='language' src={iconLang} width={32} height={32}></Image>
    </button>;
   

  return (
    <div className="mt-4 mr-8 relative">
      <Image alt={language} src={iconLang} width={32} height={32}></Image>
      <button 
        className="pl-2 focus:outline-none  "
        onClick={handleDropDown} 
        id={language}
        value={iconLang}>
          <Image  alt="V" src={'/chevrondown.svg'} width={22} height={22}></Image>
      </button>
      { hideButtons &&
      <div id='botonesocultos' className=" absolute pl-8">
        <div className="w-14 flex flex-col bg-slate-200  rounded-2xl justify-start pt-2">
          <LanguageButton language={'en'} iconLang={'/uk.svg'} />
          <LanguageButton language={'es'} iconLang={'/spain.svg'} />
          <LanguageButton language={'fr'} iconLang={'/france.svg'}  />
          </div>
      </div>}
    </div>
  )
}

export default SelectLanguage

