import React from 'react'
import { useTranslation } from "next-i18next";
import { convDate } from '../utils/misc.js'


function DisplayResults({fields,results, actions, t}) {
//  const { t } = useTranslation("companies");
console.log('results', results)
console.log('fields', fields)
  const numCols=fields.length
  if (!results.length) return 
      <div className="text-red-600 font-xl">
        {t('noresults')}
      </div>  // we won't check later if there are results
  return (
    <div className="flex justify-center">
         <table className="table-fixed w-full">
         <thead className="bg-orange-100 font-khula font-bold text-sm text-orange-600 border-2 rounded-lg   ">
            <tr className="text-left ">
                { fields.map (titleField =>
                   <th key={t(titleField.id)} className="px-2 py-3 ">
                  {t(titleField.fieldName)}</th>
                )}
            </tr>
         </thead>
         <tbody className="bg-slate-200">
            {
              results.map(elem =>
              <tr key={elem._id} className="text-stone-600 font-khula font-bold">
                  <td className="p-2 ">{elem[fields[0].fieldName]}</td>
                  <td>{elem[fields[1].fieldName]}</td>
                  <td>{elem[fields[2].fieldName]}</td>
                  <td>{elem[fields[3].date] ? convDate(elem[fields[3].fieldName]) : elem[fields[3].fieldName]}</td>
                  <td>{elem[fields[4].date] ? convDate(elem[fields[4].fieldName]) : elem[fields[4].fieldName]}</td>
                  <td>{elem[fields[5].date] ? convDate(elem[fields[5].fieldName]) : elem[fields[5].fieldName]}</td>
              </tr>
                  )}
          </tbody>
        </table>
    </div>
  )
}

export default DisplayResults

