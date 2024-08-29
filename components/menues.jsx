import Link from "next/link";
import { forwardRef } from "react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import MenuHolder from "./layouts/menuHolder";

const companyOptions = [
  { tag: "companiessearch", link: "/companies" },
  { tag: "mypendingtxs", link: "/mypendingtxs" },
];
const rfpOptions = [
  { tag: "rfpcreate", link: "/createrfps" },
  { tag: "rfpsearch", link: "/searchrfps" },
  { tag: "myrfps", link: "/myrfps" },
];

const Menues = forwardRef(({ isVisible }, ref) => {
  const [menuRFP, setMenuRFP] = useState(false);
  const [menuCompany, setMenuCompany] = useState(false);

  const { t } = useTranslation("menus");

  const handleMenu = (option) => {
    setMenuCompany(option === "company");
    setMenuRFP(option === "rfp");
  };

  return (
    <div ref={ref} className="flex mt-12 ml-20">
      <div className="text-white lg:text-sm xl:text-base  font-normal font-roboto  flex items-start mr-8">
        <label
          onClick={() => handleMenu("company")}
          className=" cursor-pointer  decoration-orange-200 hover:text-slate-300 uppercase
                        duration-300 hover:underline underline-offset-8 hover:transition-opacity  "
        >
          &nbsp;{t("companies")}&nbsp;
        </label>
        {menuCompany && isVisible && (
          <MenuHolder
            options={companyOptions}
            t={t}
            setMenuFlag={setMenuCompany}
          />
        )}
      </div>
      <div className="text-white xl:text-base lg:text-sm font-normal font-roboto flex items-start">
        <label
          onClick={() => handleMenu("rfp")}
          className="cursor-pointer  decoration-orange-200 hover:text-slate-300 uppercase
              duration-300 hover:underline underline-offset-8 hover:transition-opacity"
        >
          &nbsp;{t("rfps")}&nbsp;
        </label>
        {menuRFP && isVisible && (
          <MenuHolder options={rfpOptions} t={t} setMenuFlag={setMenuRFP} />
        )}
      </div>
    </div>
  );
});
Menues.displayName = "Menues";
export default Menues;
