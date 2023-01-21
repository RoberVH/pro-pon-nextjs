import { rfpParams } from '../../utils/rfpItems'
import { convDate } from '../../utils/misc'
import { TableIcon } from '@heroicons/react/outline'
import {  openContest, inviteContest } from '../../utils/constants'



function RFPessentialData({t, rfpRecord}) {
    const TableEntry = ({title, value, link}) => 
    <tr>
      <td className="w-[9em]"><strong>{title}: </strong></td>
      { !Boolean(link) ?
          <td className="w-[22em] w-full text-orange-500 flex flex-wrap overflow-hidden">
            <strong>{value}</strong>
          </td>
        :
        <td className="w-[22em] w-full text-orange-500 flex flex-wrap overflow-hidden underline cursor-pointer">
          <a
          className=""
          href={value}
          target="_blank"
          rel="noreferrer">
          {value}
          </a>
        </td>
      }
    </tr>

    return (
    <div className="flex flex-col font-khula bg-white leading-8 mb-2" > 
      <div className="flex">
          <TableIcon className=" h-6 w-6 text-orange-300 mt-1 ml-2"/>
          <p className="ml-4 mt-1 text-md text-stone-900">{t('rfp')}</p>
      </div>
      <table className="table-fixed ml-2 pr-4 text-sm">
        <tbody className="">
          <TableEntry title={t('rfpform.companyId')} value={rfpRecord.companyId}/>
          <TableEntry title={t('rfpform.companyname')} value={rfpRecord.companyname} />
          <TableEntry title={t('rfpform.rfpwebsite')} value={rfpRecord.rfpwebsite} link={true}/>
          <TableEntry title={t('rfpform.openDate')} value={convDate(rfpRecord.openDate)} />
          <TableEntry title={t('rfpform.endReceivingDate')} value={convDate(rfpRecord.endReceivingDate)} />
          <TableEntry title={t('rfpform.endDate')} value={convDate(rfpRecord.endDate)} />
          <TableEntry title={t("contestType")} value={Number(rfpRecord.contestType) ===openContest ? t('open'): t('invitation')} />
        </tbody>
      </table>
      </div>
    )
  }

  export default RFPessentialData