export const proponChainId= 80001         // Polygon Mumbai
//export const proponChainId=process.env.NODE_ENV==='development' ? 80001:137         // Polygon Mumbai

// all errors labels coming from prop-pon smart contract
export const errorSmartContract = [
    'address_already_admin',
    'Insufficient_payment',
    'address_not_admin',
    'Only_owner_allow_withdraw',
    'Only_admin_can_perform'
]