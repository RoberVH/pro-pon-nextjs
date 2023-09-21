import React, { useState } from "react";

const TableValueDisplay = ({ value, handleShowRFP, t, RFP_INTERVAL }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverElements, setPopoverElements] = useState([]);

  const PopoverContent = ({ elements, handleShowRFP }) => (
    <div className="absolute z-10 border border-gray-300 p-2 overflow-y-auto max-h-64 flex flex-col 
                    items-center justify-center bg-slate-100">
      <span className="px-6 py-1 text-white  bg-slate-500 rounded-md">
        RFPs
      </span>
      {elements.map((rfpidx, index) => (
        <div
          title={t("gotorfp")}
          key={index}
          className="cursor-pointer hover:bg-gray-200 p-1"
          onClick={() => handleShowRFP(rfpidx)}
        >
          {rfpidx}
        </div>
      ))}
      <button
        onClick={closePopover}
        className="text-stone-800 bg-slate-300 mt-1 p-1 rounded-md hover:bg-slate-400 hover:text-white"
      >
        {t("close", { ns: "common" })}
      </button>
    </div>
  );

  const handlePopover = (elements) => {
    setPopoverElements(elements);
    setShowPopover(true);
  };

  const closePopover = () => {
    setShowPopover(false);
  };

  return (
    <div
      className="whitespace-nowrap relative"
      onBlur={closePopover}
      tabIndex="0"
    >
      {Array.isArray(value) ? (
        <>
          <div>
            <strong>{t("total")}</strong>: {value.length}
          </div>
          {value
            .reduce((acc, curr, index) => {
              if (index % RFP_INTERVAL === 0) {
                acc.push([curr]);
              } else {
                acc[acc.length - 1].push(curr);
              }
              return acc;
            }, [])
            .map((group, index) => (
              <span
                key={index}
                className="cursor-pointer hover:bg-slate-200"
                onClick={() => handlePopover(group)}
                title={t("showrfps")}
              >
                &nbsp;{`[${group[0]}-${group[group.length - 1]}]`}&nbsp;
              </span>
            ))}
          {showPopover && (
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <PopoverContent
                  elements={popoverElements}
                  handleShowRFP={handleShowRFP}
                />
            </div>
          )}
        </>
      ) : value.toString() === "true" ? (
        <span className="py-1 px-5   text-white bg-green-500 rounded-lg">
          {t("yes")}
        </span>
      ) : value.toString() === "false" ? (
        <span className="py-1 px-5   text-white bg-red-500 rounded-lg">
          {t("no")}
        </span>
      ) : (
        value
      )}
    </div>
  );
};

export default TableValueDisplay;
