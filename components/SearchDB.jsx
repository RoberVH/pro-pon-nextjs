import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useInputForm from "../hooks/useInputForm";
import InputCountrySel from "./InputCountrySel";
import { SearchIcon } from "@heroicons/react/outline";
import processBDerror from "../database/processBDerror";
import { LIMIT_RESULTS } from "../utils/constants";
import { toastStyleWarning } from "../styles/toastStyle";
import { toast } from "react-toastify";

const DEBOUNCING_TIME = 750;

const errorColor = {
  true: "border-red-600 border-9",
  false: "",
};

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// Function to display warning msg
const warningToast = (msgWarning) => {
  toast.warning(msgWarning, toastStyleWarning);
};
const SearchDB = forwardRef(
  ({ fields, path, setResults, setWait, setError, t, i18n }, ref) => {
    const { values, handleChange, handleReinitialize } = useInputForm();
    const [currInput, setCurrInput] = useState();
    const inputRefs = useRef([]);
    const uSEReference = useRef; // to avoid calling a hook inside a callback when setting inputRefs next line
    inputRefs.current = fields.map(() => uSEReference(null));

    inputRefs;
    const prehandleChange = (e, ref) => {
      handleChange(e);
      setCurrInput(ref);
    };

    const SearchBox = ({ field, index }) => {
      const [faultyDates, setFaultyDates] = useState(false);

      useEffect(() => {
        setFaultyDates(
          values[`${field.fieldName}_end`] <= values[`${field.fieldName}_ini`]
        );
      }, [field.fieldName]);

      const InputSearchTerm = () => {
        return (
          <input
            className="font-work-sans border-b-2 border-orange-200 text-stone-900 outline-none lg:text-xs 
                  p-2  rounded-md focus:bg-stone-100 focus:rounded-md mr-8"
            ref={inputRefs.current[index]}
            type="text"
            id={field.fieldName}
            placeholder={t(field.fieldName)}
            value={values[field.fieldName]}
            onChange={(e) => prehandleChange(e, inputRefs.current[index])}
          />
        );
      };

      return (
        <div id={`term-${field.fieldName}`} className="lg:text-xs ">
          {!field.date ? ( // no date type
            // check if country type
            field.fieldName !== "country" ? (
              <InputSearchTerm />
            ) : (
              <InputCountrySel
                t={t}
                i18n={i18n}
                handleChange={prehandleChange} //{handleChange}
                values={values}
              />
            )
          ) : (
            // field of type Date
            <div className="flex  mt-3">
              <div className="flex items-center">
                <label className="text-stone-400 mx-2 max-w-20 flex-wrap lg:text-xs">
                  {t(field.fieldName)}:
                </label>
              </div>
              <div className={`text-components flex flex-col  rounded-md w-42`}>
                <input
                  className={`font-work-sans  text-stone-900 outline-none border lg:text-xs
                py-1 pl-2  rounded-md focus:bg-stone-100 focus:rounded-md ${errorColor[faultyDates]} `}
                  type="text"
                  id={`${field.fieldName}_ini`}
                  placeholder={t("initialdate")}
                  value={values[`${field.fieldName}_ini`]}
                  onChange={handleChange}
                  onFocus={(e) => (e.currentTarget.type = "datetime-local")}
                  onBlur={(e) => {
                    e.currentTarget.type = "text";
                    e.currentTarget.placeholder = t("initialdate");
                  }}
                />

                <input
                  className={`font-work-sans  text-stone-900 outline-none  border lg:text-xs
                      py-1 pl-2  rounded-md focus:bg-stone-100 focus:rounded-md ${errorColor[faultyDates]} `}
                  type="text"
                  id={`${field.fieldName}_end`}
                  placeholder={t("finaldate")}
                  value={values[`${field.fieldName}_end`]}
                  onChange={prehandleChange} //{handleChange}
                  onFocus={(e) => (e.currentTarget.type = "datetime-local")}
                  onBlur={(e) => {
                    e.currentTarget.type = "text";
                    e.currentTarget.placeholder = t("finaldate");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      );
    };

    const getResults = async (values) => {
      for (const key in values) {
        if (values[key].trim() === "") delete values[key];
      }
      if (Object.keys(values).length === 0) return;
      // filter out country param if its value is 'default'
      if (values.country === "default") delete values.country;
      const params = new URLSearchParams(values);
      const url = path + params;
      try {
        setWait(true);
        const response = await fetch(url);
        const resp = await response.json();
        if (!response.ok) {
          let bderr = resp.msg;
          setError(new Error(t(bderr, { ns: "gralerrors" })));
        }
        setResults(resp.result);
        if (resp.count > LIMIT_RESULTS)
          warningToast(t("db_too_many_results", { ns: "gralerrors" }));
        return;
      } catch (error) {
        const msgErr = processBDerror(error);
        setError(new Error(t(msgErr.message, { ns: "gralerrors" })));
      } finally {
        setWait(false);
        if (currInput) currInput.current.focus();
      }
    };

    useEffect(() => {
      //  getResults(values)
      //debounceSearch(values, getResults)
      const debouncedGetResults = debounce(getResults, DEBOUNCING_TIME);
      debouncedGetResults(values);

      if (currInput) currInput.current.focus();
    }, [values]);

    useImperativeHandle(ref, () => ({
      resetparams() {
        handleReinitialize();
        setResults([]);
      },
    }));

    const handleCleanFields = () => {
      handleReinitialize();
      setResults([]);
    };

    // Main JSX return ************************************************************************************

    return (
      <div id="searchBD-component-main" className="py-2 flex  items-center">
        <div
          id="search-icon"
          onClick={handleCleanFields}
          className="pr-2 cursor-pointer group relative inline-block"
        >
          <SearchIcon className="ml-4 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-orange-400  " />
          <span className="tooltip-span-rigth mt-2 mr-4">
            {t("reset_search")}
          </span>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="resize ">
            {field.searchable && <SearchBox field={field} index={index} />}
          </div>
        ))}
      </div>
    );
  }
);

SearchDB.displayName = "SearchDB";

export default SearchDB;
