
// all errors labels coming from prop-pon smart contract
export const errorSmartContract = [
    'address_already_admin',
    'Insufficient_payment',
    'address_not_admin',
    'Only_owner_allow_withdraw',
    'Only_admin_can_perform',
    'insufficient_funds'
]


// Arweave File Types 
export const ArweavefileTypes = {
    requestFile : 'Request',        // RFP (Bases) Document 
    responseFile : 'Response',      // RFP response Document
    companyLegalFile : 'companyLegal'   // A document certifying company legal status (constitutive act, financial statement etc)
}

// Only  5 files each loading
export const MAX_FILES = process.env.NEXT_PUBLIC_MAX_FILES//15

// Only  100 MB each loading
export const MAX_CAPACITY_FILES = process.env.NEXT_PUBLIC_MAX_CAPACITY_FILES // 104_857_600

// Company Id (tax payer title) for countries
// value of property must have a corresponding entry on public/locales/signup.json file
export const companyIdPlaceHolder = {
    'MEX':'mexicoCompanyId',
    'COL':'colombiaCompanyId',
    'CHL':'chileCompanyId'
}
