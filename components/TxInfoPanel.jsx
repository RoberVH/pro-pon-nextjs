import Image from 'next/image'

//recordingcompanylegend
//savingtoblockchainmsg
//companyessentialdataposted
//chekhash
//block
//companyessentialdatasaved
//completeprofile

const TxInfoPanel = ({
    itemPosted,
    itemCreated,
    hash,
    link,
    block,
    handleDataEdition,
    t,
    txPosted
    }) => //border-[#023c66]
  <div className="  py-1 bg-white border   rounded-md border-orange-300
                  border-solid shadow-xl mb-2">
    <div className="text-xl font-khula  text-base py-4 pl-2">
        <div className="flex mb-2">
            <Image alt="Info" src="/information.svg" height={20} width={20}/>
            <p className="ml-2 mt-1 text-gray-600 text-extrabold text-base text-xl">
                <strong>{t('recordingcompanylegend')} </strong></p>
        </div>
        <div className="mt-4 pl-4">
           <p>{t('savingtoblockchainmsg')} </p> 
           <div className="bg-white  scroll-auto">
            {txPosted && <p>{t('companyessentialdataposted')} </p> }
            {hash && 
                 <div>
                    <label className="mt-4"> {t('chekhash')}</label>
                    <a
                        className=" text-blue-600 ml-3"
                        href={link}
                        target="_blank"
                        rel="noreferrer">
                        &nbsp;
                        <strong>{hash && (`${hash.slice(0,10)}...${hash.slice(-11)}`)}</strong>
                    </a>
                 </div>
            }
            {block && 
                <div className="flex">
                      <p> {t('block')}</p>
                      <p className="text-blue-700 "> <strong>&nbsp; {block}</strong></p>
                </div>
            }
            {itemCreated && 
              <div>
                <p className="mt-2 mb-4">
                <strong>{t('companyessentialdatasaved')} </strong></p>
                <div className="flex justify-center">
                    <button 
                        className="main-btn my-4"
                        onClick={handleDataEdition}>
                        {t('completeprofile')
                        }
                    </button>
                </div>
              </div>
            }
            </div>
        </div>
    </div>
  </div>;

export default TxInfoPanel;
  