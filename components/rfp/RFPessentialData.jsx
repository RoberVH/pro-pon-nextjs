import { rfpParams } from "../../utils/rfpItems";
import { convDate } from "../../utils/misc";
import { TableIcon } from "@heroicons/react/outline";
import { openContest, inviteContest } from "../../utils/constants";

function RFPessentialData({ t, rfpRecord }) {
  const TableEntryBadge = ({ contestType, title, value }) => (
    <tr className="">
      <td className="w-[9em] mb-2 text-components ">
        <strong>{title}: </strong>
      </td>
      <td className="w-[22em] text-orange-500 flex flex-wrap overflow-hidden">
        <p
          className={`w-[90px]  mb-2 pt-1 text-components text-white text-center rounded-lg ${
            contestType === openContest ? " bg-green-400" : " bg-red-400"
          }`}
        >
          <strong>{value}</strong>
        </p>
      </td>
    </tr>
  );

  const TableEntry = ({ title, value, link }) => (
    <tr className="text-components">
      <td className="w-[9em]">
        <strong>{title}: </strong>
      </td>
      {!Boolean(link) ? (
        <td
          className="text-components 3xl:w-[20em] 2xl:w-[16em] xl:w-[14em] lg:w-[12em] text-orange-500 flex flex-wrap overflow-hidden"
          title={value}
        >
          <strong>{value}</strong>
        </td>
      ) : (
        <td className="text-components 3xl:w-[20em] 2xl:w-[16em] xl:w-[14em] lg:w-[12em] text-orange-500 flex flex-wrap overflow-hidden underline cursor-pointer">
          <a className="" href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        </td>
      )}
    </tr>
  );

  return (
    <div className="flex flex-col font-khula bg-white leading-8 mb-2">
      <div className="flex">
        <TableIcon className=" lg:h-4 lg:w-4 xl:h-6  xl:w-6  text-orange-300 mt-1 ml-2" />
        <p className="ml-4 my-2 text-components text-stone-900">
          {t("rfp")}
        </p>
      </div>
      <table className="table-fixed ml-2 pr-4 ">
        <tbody className="">
          <TableEntryBadge
            title={t("contestType")}
            value={
              Number(rfpRecord.contestType) === openContest
                ? t("open")
                : t("invitation")
            }
            contestType={rfpRecord.contestType}
          />
          <TableEntry title={t("rfpform.index")} value={rfpRecord.rfpIndex} />
          <TableEntry
            title={t("rfpform.companyId")}
            value={rfpRecord.companyId}
          />
          <TableEntry
            title={t("rfpform.companyname")}
            value={rfpRecord.companyname}
          />
          <TableEntry
            title={t("rfpform.rfpwebsite")}
            value={rfpRecord.rfpwebsite}
            link={true}
          />
          <TableEntry
            title={t("rfpform.openDate")}
            value={convDate(rfpRecord.openDate)}
          />
          <TableEntry
            title={t("rfpform.endReceivingDate")}
            value={convDate(rfpRecord.endReceivingDate)}
          />
          <TableEntry
            title={t("rfpform.endDate")}
            value={convDate(rfpRecord.endDate)}
          />
        </tbody>
      </table>
    </div>
  );
}

export default RFPessentialData;
