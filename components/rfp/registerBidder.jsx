/**
 *  RegisterBidder
 *  Component that gets render when dealing with a OPEN contest
 *  it allows a company to register to the Open RFP
 *  it detects and warns in case company is already registered
 *  params: inviteContest - Boolean if false then is an open contest
 */     

import { useState, useCallback, useEffect } from 'react'
//import { documentRequestType, openContest, inviteContest } from '../../utils/constants'
import SearchDB from '../SearchDB';
import DisplayResults from '../DisplayResults'
import Spinner from '../layouts/Spinner'
import { companyFields } from '../../utils/companyFieldsonRFP';
import { nanoid } from 'nanoid';
// toastify related imports
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { toastStyle } from '../../styles/toastStyle'
import { useRegisterBidders } from '../../hooks/useRegisterBidders'
import ShowTXSummary  from './ShowTXSummary'
import { getDBGuestCompaniesAddresses } from '../../database/dbOperations'
 import { useBidders } from '../../hooks/useBidders'
import { parseWeb3Error } from '../../utils/parseWeb3Error'


const RegisterBidder = ({bidders, setBidders, t, t_companies, rfpRecord, 
  companyId, inviteContest, guests, address,i18n}) => {
 const [alreadyRegistered, setAlreadyRegistered] = useState(bidders.includes(address))
 const [allowedtoRegister, setAllowed] = useState(false)
 const [rfpOwner, setrfpOwner ] = useState(companyId===rfpRecord.companyId) 
 const [guestCompanies, setGuestCompanies] = useState([]) 
 const [results, setResults] = useState([]);
 const [error, setError] = useState(false);
 // Next  is for SearchDB component & make Spinner spin when searching
 const [IsWaiting, setIsWaiting] = useState(false)  
 const [recordingtoContract, setRecordingtoContract] = useState(false)
 const [uploading, setUploading] = useState(false)
 const [sendingBlockchain, setsendingBlockchain] = useState(false)
 const [showPanel, setShowPanel] = useState(false)

 const companyActions = [
        { id:1,
          iconAction:'📍',
          titleAction:'Invite',
          callBack:handleAddGuestCompanytoList,
          width: '[5%]'}
        ]    

const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
    };         
    const { write, postedHash, block, link, blockchainsuccess } = useRegisterBidders(onError);

    
    const onSuccess = () => {
      refreshBidders()
    }
      // Handle Error method passed unto useWriteFileMetada hook
  function onError(error) {
    const customError = parseWeb3Error(t, error);
    errToasterBox(customError);
    setUploading(false);
    setsendingBlockchain(false);
  }
    
    function handleAddGuestCompanytoList(company) {
     if (company.address.toLowerCase()===address) {
         errToasterBox(t('canotinvite_self'))
         return
     }
     if (checkIncluded(company.companyId)) {
        errToasterBox(`${company.companyname} ${t('already_registered')}`)
        return
        }
     setGuestCompanies(prev => [...prev, 
            {companyId:company.companyId, 
              name:company.companyname,
              address:company.address
            }])
    }


    const handleRegisterItself = () => {
        setBidders([{name:'Big Corporation'},{name:'Meidum Corporation'}])
    }

    const handleRemoveCompany= (companyId)  => {
        setGuestCompanies(guestCompanies.filter(company => companyId!== company.companyId))
    }

    const handleClosePanel = () =>{ 
      setShowPanel(false)
      setGuestCompanies
    }

    const handleRegisterGuests = async () => {
      const addresses=  guestCompanies.filter(obj => obj.status !== 'fulfilled')
                        .map(obj => obj.address);
      const notRetrieved=  guestCompanies.filter(obj => obj.status === 'fulfilled')
                        .map(obj => obj.name);  
      if (addresses.length){
        setShowPanel(true)
        write('inviteguests', rfpRecord.rfpidx, companyId, addresses)
    }

    }
 const InformativeMsg =(title) => 
     <div className="p-4">
        <div className="mt-4 w-2/3 min-w-full  border-2 border-coal-500 
            flex shadow-lg p-4 justify-center items-center">    
          <p className="text-stone-600"> {t('title')} </p>  
        </div>
    </div>

const checkIncluded=(id) => Boolean(guestCompanies.filter(cia => (cia.companyId===id)).length) 

 const InvitedCompanies = () => {
  return (
    <div className="h-[25em] overflow-y-auto p-2">
   <table className="p-2 w-full h-[5em] h-full table-fixed border-2 border-orange-100 font-khula">
    <thead>
    <tr className=" border-2 border-orange-500 text-stone-500 ">
        <th className="pt-1 w-1/6 border-r-2 border-orange-500 break-words">{t('remove_guest')}</th>
        <th className="pt-1 w-1/3 border-r-2 border-orange-500 break-words">{t('id_guest')}</th>
        <th className="pt-1 w-2/3 break-words">{t('company_guest')}</th>
    </tr>
    </thead>
    <tbody>
    { guestCompanies.map( company => ( 
        <tr key={nanoid()} className="even:bg-slate-200 odd:bg-orange-100 text-stone-600" >
            <td onClick={()=>handleRemoveCompany(company.companyId)}
                 className="text-center cursor-pointer">⛔</td>
        <td className="p-1 border-r-2 border-white truncate">{company.companyId}</td>
        <td className="p-1 truncate"> {company.name} </td>
        </tr>))
         }
        </tbody>
    </table>
    </div>
    )}
 
 
 const ButtonsRegisterGuests =
        (<div className="mt-2 mb-4 flex  p-4 justify-center items-center">
                <button className="main-btn" onClick={handleRegisterGuests}>
                   {t('register_gueststo_rfp')}
                </button>
            <button className="main-btn ml-16">
                {t('cancelbutton')}
            </button>
        </div>)

const ButtonsRegistertoOpen  =
(<div className="mt-2 mb-4 flex  p-4 justify-center items-center">
        <button className="main-btn" onClick={handleRegisterItself}>
           {t('registerto_rfp')}
        </button>
    <button className="main-btn ml-16">
        {t('cancelbutton')}
    </button>
</div>)

 return (
  <div className="p-1">
    <div className="mt-4  border-2 border-coal-500 ">
     <p className="text-stone-600 p-4 ">
       {rfpOwner ? t('register_guest') : t('register_open') }
     </p>
     <div className="m-2 p-2">
      {inviteContest  &&
        <>
         <div className=" my-2 flex">
          <>
           <div id="owner-rfp-invitation" className="shadow w-3/5 h-[25em] outline-1 border border-orange-500 rounded-lg">
            <SearchDB 
                i18n={i18n} 
                fields={companyFields}
                path={`/api/servercompanies?`}
                setResults={setResults}
                setWait={setIsWaiting}
                setError={setError}
                t={t_companies}/> 
            { IsWaiting ? 
            <Spinner /> :
            (<div className="mt-8 w-full">
                {(results.length>0) ? (
                <DisplayResults
                    fields={companyFields}
                    results={results}
                    actions={companyActions}
                    t={t}/>
                ) :  
                <div className="bg-orange-100 p-4 text-red-600 text-xl text-center">
                        {t('noresults',{ ns: 'common' })}
                    </div>}
                </div>)
            }               
           </div>
           <div className="ml-2 w-2/5  ">
            <div className="shadow outline-1 border border-orange-500 rounded-lg">
                <InvitedCompanies />
            </div>
           </div>  
          </>
         </div>
           {ButtonsRegisterGuests}
        </>
      }
      {/* Here goes blockchain Tx status informative panel */}
      {!inviteContest &&
        <>
          <div>
          {ButtonsRegistertoOpen}
          </div>
        </>
      }
      {showPanel && 
      <div className="py-1 bg-white border rounded-md border-orange-300
          border-solid shadow-xl mb-2">
          <div className="text-xl font-khula text-base py-4 pl-2">
              <ShowTXSummary 
                postedHash={postedHash}
                link={link}
                block={block}
                t={t}
                handleClose={handleClosePanel}
              />
          </div>
        </div>}
     </div>
    </div>
  </div>
)
};
export default RegisterBidder;