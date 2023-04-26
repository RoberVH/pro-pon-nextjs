/**
 * This code defines two components: RfpCard and RfpCards. RfpCard is a simple card component that displays the name and description 
 * of an RFP. RfpCards is the main component that displays a grid of RFP cards in a masonry-type layout with four columns.
 * In RfpCards, we first calculate the number of columns and the width of each column. We then create an array of columns and assign 
 * each RFP to a column based on its index. Finally, we render the columns as a grid using the grid and grid-cols classes from 
 * Tailwind CSS. The gap class sets the gap between the columns, and we use media queries to adjust the number of columns based
 *  on the screen size.
 */

import React, { useState } from 'react';
import { Fragment } from 'react';
import { convDate } from '../../utils/misc'
import { buildRFPURL } from "../../utils/buildRFPURL";
import { useRouter } from "next/router"
import { rfpParams } from '../../utils/rfpItems';
import { ethers } from 'ethers'


function RfpCards({ rfps, setIsWaiting, companyData, t }) {
  const [declared, setDeclared] = useState(false);
  const [typeRFP, setTypeRFP] = useState(0);
  const [statusContest, setstatusContest] = useState(0);
  const router = useRouter()

  

const handleStatusChange = (event) => {
  setDeclared(event.target.checked);
};

const handleTpyeChange = (event) => {
  setTypeRFP(event.target.value);
};

const typeOfContest = ['open', 'invitation']
const contestStatus = ['pending', 'declared', 'canceled']


  // ******************** Inner components ***********************************

const  RfpCard = ({ rfp }) => {
  const handleShowRFP = (rfpParams) => {
      setIsWaiting(true);
  
      const urlLine={
          companyId: companyData.companyId,
          companyname: companyData.companyname,
          rfpidx:rfpParams.rfpIndex
      }
      const rfphomeparams = buildRFPURL(urlLine);
      router.push("/homerfp?" + rfphomeparams);
      };
      const canceled = rfp.canceled
      let bg = 'bg-white'
      if (canceled) bg='bg-red-100'
      if (rfp.winners.length) bg='bg-green-100'
      return (
      <div className={`${bg} rounded-lg shadow-lg px-6 py-4`}>
          <div className="text-md flex justify-between">
            <p className=" ">Id: {rfp.name}</p>
            <p className="">{rfp.contestType===0 ? t('open') : t('invitation') }</p>
          </div>
          
          <p className="mt-2 text-gray-500 text-sm"><strong>{t('description')}: </strong> {rfp.description}</p>
          <p className="mt-2 text-gray-500 text-sm"><strong>{t('open')}: </strong> {convDate(rfp.endReceivingDate)}</p>
          <p className="mt-2 text-gray-500 text-sm"><strong>{t('end_receiving')}: </strong>{convDate(rfp.openDate)}</p>
          <p className="mt-2 text-gray-500 text-sm"><strong>{t('end')}: </strong>{convDate(rfp.endDate)}</p>
          { canceled  &&   <p className="text-red-500 text-sm">{t('canceled')}</p>}
          <div className="text-blue-500 flex justify-end mb-2 mr-2">
          <button className="text-white font-khula text-xl font-semibold rounded-full py-2 px-4 bg-orange-300 hover:bg-orange-500
           " onClick={() => handleShowRFP(rfp)}>
              {t('go')}
          </button>
          </div>
      </div>
    )
  };

  const RadioInput = ({ value, typeRFP, handleRadioChange }) => (
    <label  htmlFor={value}>
      <input
        type="radio"
        id={value}
        name="typeRFP"
        value={t(`${value}`)}
        checked={typeRFP === t(`${value}`)}
        onChange={handleRadioChange}
      />
      <span className="ml-2">{value}</span>
    </label>
  );


   
  const columnCount = 1;
  const columnWidth = 800 / columnCount;
 
  const columns = new Array(columnCount).fill().map(() => []);
  //rfps.sort((a, b) => parseInt(b.openDate.toString()) - parseInt(a.openDate.toString()));
  rfps.sort((b, a) => {
    const cmp = ethers.BigNumber.from(b.openDate).sub(ethers.BigNumber.from(a.openDate));
    return cmp.gt(0) ? 1 : cmp.eq(0) ? 0 : -1;
  })
  rfps.forEach((rfp, index) => {
     const column = index % columnCount;
     columns[column].push(rfp);
  });
 
  return (
    <div className="m-2">
           
      <div className="bg-white rounded-lg my-4 flex p-4 shadow-lg">
          <div id="tpyecontest" className="ml-8 flex items-center border border-orange-400 rounded-lg p-4">
              <div className="mr-4">{t('statuscontest')}</div>
                <div className="flex flex-col space-y-2 ">
                  {contestStatus.map((option) => (
                    <input
                      id={option}
                      name="statusRFP"
                      type="checkbox"
                      key={option}
                      value={t(`${option}`)}
                      checked={typeRFP === t(`${option}`)}
                      typeRFP={typeRFP}
                      handleRadioChange={handleStatusChange}
                    />
                    ))} 
          </div>          
        </div>  
        <div id="tpyecontest" className="ml-8 flex items-center border border-orange-400 rounded-lg p-4">
            <div className="mr-4">{t('contestType')}</div>
              <div className="flex flex-col space-y-2 ">
                {typeOfContest.map((option) => (
                  <RadioInput
                    key={option}
                    value={t(`${option}`)}
                    typeRFP={typeRFP}
                    handleRadioChange={handleTpyeChange}
                  />
                  ))} 
        </div>          
        </div>  
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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