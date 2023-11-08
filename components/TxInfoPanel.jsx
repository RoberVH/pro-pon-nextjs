import Image from "next/image";
import SpinnerBar from "./layouts/SpinnerBar";

/**
    postedHash,
    block,
    t,
    handleClosePanel,
    blockchainsuccess,
    handleCancelTx 
 */
const TxInfoPanel = ({
  hash,
  block,
  handleCancelTx,
  handleClosePanel,
  t,
  blockchainsuccess,
}) => (
  <div
    className="mx-auto mt-4 mb-8 p-4 border rounded-md border-orange-300 border-solid shadow-xl bg-white bg-opacity-100
                  font-khula py-4 pl-2 "
  >
    <div className="py-4 pl-2">
      <div className="flex mb-2">
        <Image alt="Info" src="/information.svg" height={17} width={17} />
        <p className="text-components ml-2 mt-1 text-gray-600 text-bold  pr-4">
          <strong>{t("recordingcompanylegend")} </strong>
        </p>
      </div>
    </div>
    <div className="mb-2 ml-8 lg:w-[32em] xl:w-[38em] 2xl:w-[45em] flex flex-col justify-between">
      <div>
        <p className="text-components">{t("savingtoblockchainmsg")} </p>
        {hash && (
          <div className="text-components">
            <p>{t("companyessentialdataposted")}</p>
            <label className="mt-4 lg:text-xs xl:text-sm 2xl:text-base">
              {" "}
              {t("chekhash")}
            </label>
            <a
              className="lg:text-xs xl:text-sm 2xl:text-base text-blue-600 ml-3"
              href={`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${hash}`}
              target="_blank"
              rel="noreferrer"
            >
              &nbsp;
              <strong>
                {hash && `${hash.slice(0, 10)}...${hash.slice(-11)}`}
              </strong>
            </a>
          </div>
        )}
        {block && (
          <div className="text-components flex">
            <p> {t("block")}</p>
            <p className="text-orange-700">
              {" "}
              <strong>&nbsp; {block}</strong>
            </p>
          </div>
        )}
        {blockchainsuccess && (
          <div className="flex justify-center mt-8">
            <button className=" secondary-btn" onClick={handleClosePanel}>
              {t("closebutton")}
            </button>
          </div>
        )}
      </div>
      <div>
        {!blockchainsuccess && (
          <>
            <div className="mt-4 mb-2">
              <SpinnerBar msg={t("loading_to_blockchain")} />
            </div>
            <div className="flex justify-center mt-2">
              <p className=" text-components text-orange-400 font-bold pl-12">
                {t("waiting_transaction")}
              </p>
            </div>
          </>
        )}
        {hash && !blockchainsuccess && (
          <div className="flex justify-center mt-4">
            <button
              title={t("cancel_tx")}
              onClick={handleCancelTx}
              className="txCancel-btn"
            >
              {t("cancelbutton")}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TxInfoPanel;
