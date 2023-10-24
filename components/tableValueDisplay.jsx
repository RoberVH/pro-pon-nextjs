import React, { useEffect, useRef, useState } from "react";
import { getRFPIdentityDataProvider } from "../web3/getRFPIdentityDataProvider";
import { getRFPIdentityDataServer } from "../web3/getRFPIdentityDataServer";

const TableValueDisplay = ({ value, handleShowRFP, t, RFP_INTERVAL }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverElements, setPopoverElements] = useState([]);


  const rfpData=useRef(null)

  // inner components
  const PopoverContent = ({ elements, handleShowRFP }) => {
    const [isDataFetched, setIsDataFetched] = useState(false)

  // hooks
  useEffect(()=>{
    let isMounted = true
    async function fetchRFPData() {
      
      const data = await Promise.all(elements.map(async (element) => {
        // if a etheruem provider wallet exists (Metamask) use it to retrieve data, otherwise we must be dealing
        // with a read-onmly user, then retrieve data through out server alchemy link provider
        if (window.ethereum)
          return getRFPIdentityDataProvider(element)
        else {
        return getRFPIdentityDataServer(element)}
      }))
      // because changes to smart contract we need to remeber that
      // props from Smart Contract mean different than UI. name ion contract mean RFP Id, and description in contract mean RFP Name
      if (isMounted) {
        const rfpIdData = data.map(elem => 
          elem.status 
          ? {idx: parseInt(elem.RFP.rfpIndex), tag: `${elem.RFP.name} | ${elem.RFP.description}`} 
          : t("not_available")
        )
        rfpData.current=rfpIdData
        setIsDataFetched(true)
      }
    }

    fetchRFPData()
    return () => {
      isMounted = false
    }
  }, [])

  // utility functions
  const tagsRFP = (idx) => {
    if (isDataFetched && rfpData.current && Array.isArray(rfpData.current) && rfpData.current.length > 0) {
      const foundElement = rfpData.current.find(element => element.idx === idx)
      return foundElement ? foundElement.tag : t("gotorfp")
    }
  }

  return (
      <div
      className="absolute z-10 border border-gray-300 p-2 overflow-y-auto max-h-64 flex flex-col
                 items-center justify-center bg-slate-100"
    >
      <span className="px-6 py-1 text-white  bg-slate-500 rounded-md">
        RFPs
      </span>
      {elements.map((rfpidx, index) => (
        <div
          title={tagsRFP(rfpidx)}
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
  )};

  const handlePopover = (elements) => {
    setPopoverElements(elements);
    setShowPopover(true);
  };

  const closePopover = () => {
    setShowPopover(false);
  };

  // Main JSX 
  return (
    <div
      className="whitespace-nowrap relative"
      onBlur={closePopover}
      tabIndex="0"
    >
      {Array.isArray(value) ? (
        <>
          <div>
            <strong>{t("total")}: {value.length}</strong>
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
          {showPopover &&  (
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
