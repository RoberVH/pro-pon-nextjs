/**
 *  components/InputCountrySel.jsx
 *     Display a user-selected language dropdow box to choose a country for
 *    Is used by components components/SearchDB.jsx
 *    When company is being  searched, allow to select a Country from the list and save it when selected to
 *    state vales using handleChange passed prop method
 *    for Search component the existing input-controls/InputCountrySel component was not used because was hard
 *    to adapt it to this use case when there is not disabling if in profile editing mode
 */

import { useState, useEffect } from "react";
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import spanish from "i18n-iso-countries/langs/es.json";
import french from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(english);
countries.registerLocale(spanish);
countries.registerLocale(french);

export const InputCountrySel = ({ t, handleChange, values, i18n }) => {
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

  return (
    <select
      className="font-work-sans border-b-2 border-orange-200 text-stone-900 outline-none w-2/3
                       p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8 bg-white"
      onChange={handleChange}
      id={"country"}
      value={values.country}
    >
      <option value={"default"}>{t("selectcountry", { ns: "common" })}</option>
      {countryList.map((country, index) => (
        <option
          key={index}
          value={countries.getAlpha3Code(country, i18n.language)}
        >
          {country}
        </option>
      ))}
    </select>
  );
};

export default InputCountrySel;
