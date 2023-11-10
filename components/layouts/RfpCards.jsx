/**
 * This code defines two components: RfpCard and RfpCards. RfpCard is a simple card component that displays the name and description
 * of an RFP. RfpCards is the main component that displays a grid of RFP cards in a masonry-type layout with four columns.
 * In RfpCards, we first calculate the number of columns and the width of each column. We then create an array of columns and assign
 * each RFP to a column based on its index. Finally, we render the columns as a grid using the grid and grid-cols classes from
 * Tailwind CSS. The gap class sets the gap between the columns, and we use media queries to adjust the number of columns based
 *  on the screen size.
 */

import React, { useState } from "react";
import { Fragment } from "react";
import { convDate } from "../../utils/misc";
import { buildRFPURL } from "../../utils/buildRFPURL";
import { useRouter } from "next/router";
import { rfpParams } from "../../utils/rfpItems";
import { ethers } from "ethers";

function RfpCards({ rfps, setIsWaiting, companyData, t }) {
  const router = useRouter();

  // ******************** Inner components ***********************************

  const RfpCard = ({ rfp }) => {
    const handleShowRFP = (rfpParams) => {
      setIsWaiting(true);
      const urlLine = {
        companyId: companyData.companyId,
        companyname: companyData.companyname,
        rfpidx: rfpParams.rfpIndex,
      };
      const rfphomeparams = buildRFPURL(urlLine);
      router.push("/homerfp?" + rfphomeparams);
    };
    const canceled = rfp.canceled;
    let bg = "bg-white";
    if (canceled) bg = "bg-red-100";
    if (rfp.winners.length) bg = "bg-green-100";
    return (
      <div
        className={`${bg} font-roboto rounded-lg  lg:px-4 py-4 border border-orange-300 lg:w-[18rem] xl:w-[24rem] `}
        style={{ boxShadow: "6px 6px 12px rgba(0, 0, 0, 0.3)" }}
      >
        <div className="lg:text-xs xl:text-sm 2xl:text-base flex justify-between mb-4">
          <p className="lg:w-[8em] overflow-hidden truncate" title={rfp.name}>Id: {rfp.name}</p>
          {canceled && (
            <p className="text-red-500 lg:text-xs xl:text-sm 2xl:text-base">
              {t("canceled").toUpperCase()}
            </p>
          )}
          {Boolean(rfp.winners.length) && (
            <p className="text-green-800 lg:text-xs xl:text-sm 2xl:text-base">
              {t("declared").toUpperCase()}
            </p>
          )}
          <p className="">
            {rfp.contestType === 0 ? t("open") : t("invitation")}
          </p>
          <button
            className=" text-orange-500 font-work-sans lg:text-xs xl:text-sm 2xl:text-base font-semibold"
            onClick={() => handleShowRFP(rfp)}
          >
            <p className="underline lg:text-xs xl:text-sm 2xl:text-base">
              {" "}
              {t("go")}
            </p>
          </button>
        </div>
        <p
          className="mt-2 lg:text-xs xl:text-sm 2xl:text-base text-gray-500 text-sm truncate"
          title={rfp.description}
        >
          <strong>{t("description")}: </strong> {rfp.description}
        </p>
        <p className="mt-2 lg:text-xs xl:text-sm 2xl:text-base text-gray-500 text-sm">
          <strong>{t("open")}: </strong> {convDate(rfp.openDate)}
        </p>
        <p className="mt-2 lg:text-xs xl:text-sm 2xl:text-base text-gray-500 text-sm">
          <strong>{t("end_receiving")}: </strong>
          {convDate(rfp.endReceivingDate)}
        </p>
        <p className="mt-2 lg:text-xs xl:text-sm 2xl:text-base text-gray-500 text-sm">
          <strong>{t("end")}: </strong>
          {convDate(rfp.endDate)}
        </p>
        <div className="text-blue-500 flex justify-end mb-2 mr-2"></div>
      </div>
    );
  };

  const columnCount = 1;
  const columnWidth = 800 / columnCount;

  const columns = new Array(columnCount).fill().map(() => []);
  //rfps.sort((a, b) => parseInt(b.openDate.toString()) - parseInt(a.openDate.toString()));
  rfps.sort((b, a) => {
    const cmp = ethers.BigNumber.from(b.openDate).sub(
      ethers.BigNumber.from(a.openDate)
    );
    return cmp.gt(0) ? 1 : cmp.eq(0) ? 0 : -1;
  });
  rfps.forEach((rfp, index) => {
    const column = index % columnCount;
    columns[column].push(rfp);
  });

  return (
    <div className="m-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
        {columns.map((column, index) => (
          <Fragment key={index}>
            {column.map((rfp, index) => (
              <RfpCard key={index} rfp={rfp} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
export default RfpCards;
