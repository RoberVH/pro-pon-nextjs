/* 
  DisplayResults component
    Display results from DataBase passed on results param. 
@module DisplayResults
@param {Array} fields - The DB fields to display in the table
@param {Array} results - The data to br displayed in a table
@param {Array} actions - The button actions to display in the table
@param {function} t - The i18n translation function
*/

import React from 'react'
import { convDate } from '../utils/misc.js'
import {  openContest } from '../utils/constants'
import { nanoid } from 'nanoid'




function DisplayResults({fields,results, actions, t}) {
  // Inner functions ******************
  const parseField = (fields, elem) => {
    if (fields.fieldName==='contestType') 
      return (
        Number(elem[fields.fieldName])===openContest ? t('open') : t('Invitation')
      )
    if (fields.date)     
        return (convDate(elem[fields.fieldName]))
      else return (elem[fields.fieldName])
    }
    // if not results return informative msg
  if (!results.length) return 
    <div className="text-red-600 font-xl">
            {t('noresults')}
    </div>  // we won't check later if there are results
  // There are results. display them
  return (
    <div className="">
         <table className="table-fixed w-full ">
         <thead className="bg-orange-100 font-khula font-bold text-sm text-orange-600 border-2 rounded-lg">
            <tr className="text-left">
                { fields.map (titleField =>
                   <th key={t(titleField.id)} 
                       className={`w-${titleField.width} px-2 py-3`}>
                  {t(titleField.fieldName)}</th>
                )}
              { actions.map (action => 
                  <th key={t(action.id)} 
                      className={`w-${action.width} px-2 py-3`}>
               {action.titleAction}</th>
              )}                
            </tr>
         </thead>
          <tbody className="">
          {
            results.map(elem => (
              <tr key={elem._id} className="text-stone-600 font-khula font-bold even:bg-slate-200 odd:bg-slate-100">
                { fields.map(fields => (
                  <td key={nanoid()} className="p-2 truncate">
                      {parseField(fields, elem)}
                   </td>)) 
                }
         
          { actions.map ( action => 
                <td key={`action_${action.id}`} className="hover:pointer"> 
                    <button className="cursor-pointer outline-orange-600 
                        hover:outline hover:outline-1 "
                    onClick={()=>action.callBack(elem)}>
                      {action.iconAction}
                    </button>
                </td>                  
                  )}    
              </tr>)
              )}
          </tbody> 
        </table>
    </div>
  )
}

export default DisplayResults

