import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLocaleChange = (event) => {
    const value = event.target.value;

    router.push(router.route, router.asPath, {
      locale: value,
    });
  };

  return (
    <header className="flex justify-center mb-8">
      <nav className="text-2xl">
        <div className=" flex justify-center mt-4 pl-4 ">
          <Link href="/" >
            <a className={router.asPath === "/" ? "active" : ""}>{t("home")}</a>
          </Link>
          <div  className="ml-4">
              <Link  href="/about">
              <a className={router.asPath === "/about" ? "active" : ""}>{t("about")}</a>
              </Link>
          </div>
        </div>
      </nav>
      <br></br>
      <div className=" mt-4 pl-8 text-2xl">

      <select onChange={handleLocaleChange} value={router.locale}>
        <option value="en">🇺🇸 English</option>
        <option value="es">🇨🇳 español</option>
        <option value="fr">🇸🇪 francois</option>
      </select>

      <style jsx>{`
        a {
          margin-right: 0.5rem;
        }

        a.active {
          color: blue;
        }

        nav {
          margin-bottom: 0.5rem;
        }
      `}</style>
      </div>
    </header>
  );
};

export default Header;