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

const ShowTXSummary = ({
    postedHash,
    link,
    block,
    t,
    handleClosePanel
    }) =>   
     <>
     <p>{t('savingtoblockchainmsg')}</p>
      {postedHash && <p>{t("rfpessentialdataposted")}</p>}
      {link && (
        <div>
          <label>{t("chekhash")}</label>
          <a
            className=" text-blue-600 "
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {`${postedHash.slice(0, 10)}...${postedHash.slice(-11)}`}
          </a>
        </div>
      )}
      {block && (
        <>
          <div>
            <label>{t("block")} </label>
            <label className="text-blue-600">&nbsp;{block}</label>
          </div>
          <div className="flex justify-center ">
            <button 
              className="py-2 px-4 rounded-md font-bold bg-stone-400 text-white hover:bg-stone-700 hover:shadow-lg focus:ring-0 active:bg-stone-800
                        text-base focus:bg-stone-700 focus:shadow-lg"
              onClick={handleClosePanel} >
                {t('closebutton')}
            </button>
          </div>
        </>
      )}
      
   </>
export default ShowTXSummary;