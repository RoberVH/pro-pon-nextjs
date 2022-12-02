import React from 'react'
import { convDate } from '../utils/misc.js'


function DisplayResults({fields,results, actions, t}) {
  if (!results.length) return 
      <div className="text-red-600 font-xl">
        {t('noresults')}
      </div>  // we won't check later if there are results
  return (
    <div className="">
         <table className="table-fixed w-full ">
         <thead className="bg-orange-100 font-khula font-bold text-sm text-orange-600 border-2 rounded-lg   ">
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
              results.map(elem =>
              <tr key={elem._id} className="text-stone-600 font-khula font-bold even:bg-slate-200 odd:bg-slate-100">
                  <td className="p-2  ">{elem[fields[0].fieldName]}</td>
                  <td>{elem[fields[1].fieldName]}</td>
                  <td className="truncate">{elem[fields[2].fieldName]}</td>
                  <td>{fields[3].date ? convDate(elem[fields[3].fieldName]) : elem[fields[3].fieldName]}</td>
                  <td>{fields[4].date ? convDate(elem[fields[4].fieldName]) : elem[fields[4].fieldName]}</td>
                  <td>{fields[5].date ? convDate(elem[fields[5].fieldName]) : elem[fields[5].fieldName]}</td>
                    { actions.map ( action => 
                          <td key={`action_${action.id}`}
                          className="hover:pointer"
                              > 
                              <button className="cursor-pointer outline-orange-600 
                                  hover:outline hover:outline-1 "
                              onClick={()=>action.callBack(elem)}>
                                {action.iconAction}
                              </button>
                          </td>                  
                    )}
              </tr>
                  )}

          </tbody>
        </table>
    </div>
  )
}

export default DisplayResults

