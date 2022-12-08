/**
 *  RegisterBidder
 *  Component that gets render when dealing with a OPEN contest
 *  it allows a company to register to the Open RFP
 *  it detects and warns in case company is already registered
 */     

import { useState, useCallback, useEffect } from 'react'
import { documentRequestType, openContest, inviteContest } from '../../utils/constants'


const RegisterBidder = ({bidders, setBidders, t, rfpRecord, companyId, inviteContest, guests, address}) => {
    const [alreadyRegistered, setAlreadyRegistered] = useState(bidders.includes(address))
    const [allowedtoRegister, setAllowed] = useState(false)
    const [rfpOwner, setrfpOwner ] = useState(companyId===rfpRecord.companyId) 
    const [guestCompanies, setGuestCompanies ] = useState([]) 

    const handleRegisterItself = () => {
        setBidders([{name:'Big Corporation'},{name:'Meidum Corporation'}])
    }

    const handleRegisterGuests = () => {

    }

 const InformativeMsg =(title) => 
     <div className="p-4">
        <div className="mt-4 w-2/3 min-w-full h-[9rem] min-h-full border-2 border-coal-500 
            flex shadow-lg p-4 justify-center items-center">    
          <p className="text-stone-600"> {t('title')} </p>  
        </div>
    </div>

 
 const selectCompanies = () => 
    <div>
        {/* show here mini component with search and display results with
        shorter search criteria and action botton to add company to list of guesses 
        side by sie add another frame to show added guests*/}
    </div>

 const ButtonsSection =
        (<div className="mt-2 mb-4 flex  p-4 justify-center items-center">
            { rfpOwner ?
                <button className="main-btn" onClick={handleRegisterGuests}>
                   {t('registerto_rfp')}
                </button>
                :
                <button className="main-btn" onClick={handleRegisterItself}>
                    {t('registerto_rfp')}
                </button>
            }
            <button className="main-btn ml-16">
                {t('cancelbutton')}
            </button>
        </div>)

    // company trying to register already has been registered
if (alreadyRegistered) return (InformativeMsg(t('already_registered')))

    // A company trying to register for an Open contest or a owner wanting to invite companies
 return (
    <div className="p-4">
        <div className="mt-4 w-2/3 min-w-full h-[10rem] min-h-full border-2 border-coal-500 shadow-lg">
        <p className="text-stone-600 p-4 ">
        {rfpOwner ? t('register_guest') : t('register_open') }
        </p>

        {ButtonsSection}
        </div>
        {console.log('RegisterBidder')}
    </div>
)
};
export default RegisterBidder;