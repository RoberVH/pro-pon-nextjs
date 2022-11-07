

const RFPIdentificator = ({t, rfpRecord}) => (
    <table className="border-separate border-spacing-1">
      <tbody>
        <tr>
          <td className="col-start-1 col-end-1">
            <label className="leading-8">
              {t("rfpform.name")}: &nbsp;{" "}
            </label>
          </td>
          <td className="text-orange-500 col-start-2 col-end-12">
            <label className="">{rfpRecord.name}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label className="">{t("rfpform.description")}: &nbsp; </label>
          </td>
          <td>
            <label className="text-orange-500">
              {rfpRecord.description}
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
  export default RFPIdentificator