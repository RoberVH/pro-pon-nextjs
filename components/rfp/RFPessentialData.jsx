import { rfpParams } from '../../utils/rfpItems'
import { convDate } from '../../utils/misc'
import { TableIcon } from '@heroicons/react/outline'


function RFPessentialData(t, rfpRecord, handleDeclareWinner) {
    const TableEntry = ({title, value}) => 
    <tr>
      <td className="w-64"><strong>{title}: </strong></td>
      <td className="w-48 text-orange-500">{value}</td>
    </tr>

    return (
    <div className="flex flex-col w-2/6
     font-khula mx-8  bg-white leading-8 shadow-md" > 
      <div className="flex">
          <TableIcon className=" h-6 w-6 text-orange-300 mt-1 ml-2"/>
          <p className="ml-4 mt-1 text-md text-stone-900">{t('rfp')}</p>
      </div>
      <table className="table-fixed ml-2 pr-4 text-sm">
        <tbody className="">
          <TableEntry title={t('rfpform.companyId')} value={rfpRecord.companyId} />
          <TableEntry title={t('rfpform.companyname')} value={rfpRecord.companyname} />
          <TableEntry title={t('rfpform.rfpwebsite')} value={rfpRecord.rfpwebsite} />
          <TableEntry title={t('rfpform.openDate')} value={convDate(rfpRecord.openDate)} />
          <TableEntry title={t('rfpform.endReceivingDate')} value={convDate(rfpRecord.endReceivingDate)} />
          <TableEntry title={t('rfpform.endDate')} value={convDate(rfpRecord.endDate)} />
        </tbody>
      </table>
      <div className="font-khula mt-6 mb-4 text-center">
            <button 
              onClick={handleDeclareWinner}
              className="py-1 px-2 leading-2 text-sm bg-orange-500 text-white font-bold uppercase rounded-md
              hover:bg-orange-300 ">
                {t('declarewinner')}
            </button>
          </div>
      </div>
    )
  }

  export default RFPessentialData