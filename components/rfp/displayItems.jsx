import { useState } from "react";
import Image from "next/image";
import { nanoid } from "nanoid";

function DisplayItems({ items, t }) {
  const [showingItems, setShowingItems] = useState(true);
  return (
    <div className="font-work-sans  bg-white leading-8 mb-2 ">
      <div className="flex justify-between">
        <div className="flex pl-2 py-1 px-4 items-center">
          <Image
            className="text-orange-400  ml-2 lg:h-10 lg:w-10"
            alt="Proposal"
            src="/surveys-icon.svg"
            width={14}
            height={14}
          />
          <p className="font-work-sans ml-2 mt-1  text-components  text-stone-900">
            {t("showItems")}
            {` (${items.length})`}
          </p>
        </div>
        <div className="mt-3 mr-4">
          {showingItems ? (
            <Image
              className="cursor-pointer"
              onClick={() => setShowingItems(!showingItems)}
              alt="V"
              src={"/dash.svg"}
              width={22}
              height={22}
            ></Image>
          ) : (
            <Image
              className="cursor-pointer"
              onClick={() => setShowingItems(!showingItems)}
              alt="V"
              src={"/chevrondown2.svg"}
              width={22}
              height={22}
            ></Image>
          )}
        </div>
      </div>
      <div className="label-warnings my-4 px-4 pb-6">
        {showingItems && (
          <ul>
            {items.map((item) => (
              <li
                key={nanoid()}
                className="truncate border-b border-dashed  border-orange-400"
              >
                <label title={item} className="px-4 w-1/6 text-orange-500">
                  <strong>{item} </strong>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DisplayItems;
