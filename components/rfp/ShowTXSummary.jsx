/**
 * ShowTXSummary component displays the summary of Tx notifications, errors, 
 *      and blockchain information
 * @param {Array} successFiles - array of successful uploaded file objects
 * @param {Array} addresses - array of companies' addresses accounts upoaded
 * @param {string} postedHash - string of posted Tx hash to the blockchain
 * @param {string} link - string of link to the Tx posted hash on the blockchain
 * @param {string} block - string of block number on the blockchain the Tx is
 * @param {function} t - translation function for the intl' language titles
 * @param {function} handleClose - function to handle the closing of the component
 */
import  Image from "next/image"
import SpinnerBar from '../layouts/SpinnerBar'


const ShowTXSummary = ({
    postedHash,
    block,
    t,
    handleClosePanel,
    blockchainsuccess,
    handleCancelTx
    }) =>   
      <div className="mx-auto mt-4 mb-8 p-4 border rounded-md border-orange-300 border-solid shadow-xl bg-white big-opacity-100
            font-khula text-base py-4 pl-2">
              <div className="flex mb-4">
              <Image alt="Info" src="/information.svg" height={20} width={20}/>
              <p className="ml-2 mt-1  text-gray-600 text-extrabold text-base ">
                  <strong>{t('sending_rfp_blockchain')} </strong>
              </p>
            </div>
            <div className="flex mb-2 h-64">
              <div className="flex flex-col justify-between">
              <div className="px-4">
                <p>{t('savingtoblockchainmsg')} </p>
                { postedHash && 
                    <div>
                      <p>{t("rfpessentialdataposted")}</p>
                          <label>{t("chekhash")}</label>
                            <a
                              className=" text-blue-600 "
                              href={`${process.env.NEXT_PUBLIC_LINK_EXPLORER}tx/${postedHash}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {`${postedHash.slice(0, 10)}...${postedHash.slice(-11)}`}
                            </a>
                    </div>
                }
                {block && (
                  <>
                    <div>
                      <label>{t("block")} </label>
                      <label className=" text-orange-700">&nbsp;{block}</label>
                    </div>
                  </>
                )}
              </div>
                { !blockchainsuccess && 
                  <div className="my-8  ">
                    <SpinnerBar msg={t('loading_data')} />
                    <div className="flex justify-center mt-2">
                            <p className=" text-orange-400 font-bold pl-12">{t('waiting_transaction')}</p>
                    </div>                    
                  </div>
                }
              <div className="flex justify-center">
                { blockchainsuccess &&
                      <button 
                        className="secondary-btn"
                        onClick={handleClosePanel} >
                          {t('closebutton')}
                      </button>
                }
                {
                  (postedHash && !blockchainsuccess) &&
                    <button 
                      title={t('cancel_tx')}
                      onClick={handleCancelTx} 
                      className="txCancel-btn">
                      {t("cancelbutton")}
                    </button>
                }
              </div>
            </div>
          </div>   
      </div>
export default ShowTXSummary;