import { useState, useEffect }from 'react'
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";
import { companyIdPlaceHolder } from '../../utils/constants'

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);    



export const InputCountrySel = ({t, handleChange, values, i18n, setPlaceHolder,
   companyData, profileCompleted}) => {
    const [countryList, setCountryList] = useState([]);

useEffect(() => {
    function changeLanguage() {
      const lang = i18n.language;
      const countryGen = countries.getNames(lang);
      const countryArray = Object.values(countryGen);
      switch (lang) {
        case "fr":
          countryArray.sort((a, b) => a.localeCompare(b, "fr"));
          break;
        case "es":
          countryArray.sort((a, b) => a.localeCompare(b, "es"));
          break;
        case "en":
        default:
          countryArray.sort((a, b) => a.localeCompare(b, "en"));
          break;
      }
      setCountryList(countryArray);
    }
    changeLanguage();
  }, [i18n.language]);

  useEffect(()=>{
    const solveCountry = async(valueCountry) => {
        if (typeof companyIdPlaceHolder[valueCountry]!== 'undefined') setPlaceHolder(companyIdPlaceHolder[valueCountry])
        else setPlaceHolder('companyId')
    }
    solveCountry(values.country)
},[values.country, setPlaceHolder])

return (
    <select
      className="form-select block w-full px-3 py-1.5 text-base font-roboto bg-stone-100 bg-clip-padding
            bg-no-repeat border border-solid border-gray-300 outline-none transition ease-in-out
            border-grey-light rounded rounded-l-none focus:bg-blue-100 
              text-black  font-khula"
      onChange={handleChange}
      id={"country"}
      value={profileCompleted ? companyData.country: "default"}>
        <option value={"default"} >
          {!profileCompleted
            ? `${t("companyform.country")}*`
            : companyData.country}
        </option>
        {countryList.map((country, index) => (
          <option key={index} value={countries.getAlpha3Code(country,i18n.language)}>
            {country}
          </option>
      ))}
  </select>
)

}

export default InputCountrySel