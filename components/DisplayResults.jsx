import React from 'react'
import { useTranslation } from "next-i18next";

function DisplayResults({fields,results, actions}) {
  const { t } = useTranslation("companies");
  const numCols=fields.length
  if (!results.length) return <div>NO hay resultados</div>  // we won't check later if there are results
  console.log('seguimos')
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
              results.map(cia =>
              <tr key={cia._id} className="text-stone-600 font-khula font-bold">
                  <td className="p-2 ">{cia[fields[0].fieldName]}</td>
                  <td>{cia[fields[1].fieldName]}</td>
                  <td>{cia[fields[2].fieldName]}</td>
                  <td>{cia[fields[3].fieldName]}</td>
                  <td>{cia[fields[4].fieldName]}</td>
                  <td>{cia[fields[5].fieldName]}</td>
              </tr>
                  )}
          </tbody>
        </table>
    </div>
  )
}

export default DisplayResults

