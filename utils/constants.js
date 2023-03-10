
// all errors labels coming from prop-pon smart contract
export const errorSmartContract = [
    'address_already_admin',
    'Insufficient_payment',
    'address_not_admin',
    'Only_owner_allow_withdraw',
    'Only_admin_can_perform',
    'insufficient_funds',
    'execution reverted: Insufficient_payment',
    'execution reverted: too_many_guests',
    'execution reverted: already_participating',
    'execution reverted: end_receiving_reached',
    // To Do: test and add custom error tags to locals gralerrors.json for each one
    'execution reverted: initial_date_wrong',
    'execution reverted: receiving_date_wrong',
    'execution reverted: wrong_contest_type',
    'execution reverted: not_open_tender',
    'execution reverted: max_participants_reached',
    'execution reverted: can_not_register_self',
    'execution reverted: not_participant',
    'execution reverted: issuer_bad_doctype,',
    'execution reverted: participant_bad_doctype',
    'execution reverted: too_many_winners',
    'execution reverted: not_matching_winners',
    'execution reverted: enddate_not_reached_yet',
    'execution reverted: cannot_self_award',
    'execution reverted: invalid_winner',
    'execution reverted: rfp_already_awarded',
    'execution reverted: id_already_exists',
    'execution reverted: rfpid_already_taken'
]


// DEPRECATED
// Arweave File Types 
// this types used for Arweave metadata when uploading files there
// export const ArweavefileTypes = {
//     requestFile : 'Request',        // RFP (Bases) Document 
//     responseFile : 'Response',      // RFP response Document
//     companyLegalFile : 'companyLegal'   // A document certifying company legal status (constitutive act, financial statement etc)
// }

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

// To easily reference this as an object instead of an array throughout the code I define a
// docTypes record as a numeric property identifying each category of document type referencing 
// a docType record
// on this version of Pro-pon (1.0) only documentProposalType document type is password protected, all others are public
export const docTypes = {
    // Doctypes for RFP Issuer
    0: {id: '0',type:'documentRequestType', desc:"request_doc", public:true},         // RFP doc  from Owner
    1: {id: '1',type:'documentQandAType', desc:"q_a_doc", public:true},               // Clarification Questions and answers from Owner
    2: {id: '2',type:'documentContract', desc:"cto_doc", public:true},                // Contract, adenda, guaranties etc documents created between owner and winners 
    // Doctypes for RFP Participant
    3: {id: '3',type:'documentProposalType',desc:"prop_doc", public:false},           // Technical offering, RFPs answers from participant
    4: {id: '4',type:'documentPricingOfferingType',desc:"pricing_doc", public:true},  // Economic Proposal from participant. It's password protected
    5: {id: '5',type:'documentLegalType',desc:"legal_doc", public:true},              // Legal documents from participants
    6: {id: '6',type:'documentFinancialType',desc:"financial_doc", public:true},      // Financial statements and documents from participants
    7: {id: '7',type:'documentAdministrativeType',desc:"admin_doc", public:true}      // Administrative documents from participants
}
// Also a IdxDocTypes is defined to better reference index of docTypes record
export const IdxDocTypes = {
    'documentRequestType':0,
    'documentQandAType':1,
    'documentContract':2,
    'documentProposalType':3,
    'documentPricingOfferingType':4,
    'documentLegalType':5,
    'documentFinancialType':6,
    'documentAdministrativeType':7
}

// privateFileTypes ar document types that will be encrypted until end of receiving proposals is met, when they'll be public
// there will be a doctype that will never be public: the documentProposalType, that is the technical offering
export const privateFileTypes = [
    IdxDocTypes.documentProposalType,
    IdxDocTypes.documentPricingOfferingType,
    IdxDocTypes.documentLegalType,
    IdxDocTypes.documentFinancialType,
    IdxDocTypes.documentAdministrativeType
]

export const openContest = 0  
export const inviteContest = 1  

export const PRODUCTION = false
export const LOCAL = false

export const Content_types = {
"368": "application/andrew-inset",
"949": "application/atom+xml",
"6576": "application/font-woff",
"930": "application/java-archive",
"4000": "application/javascript",
"6347": "application/json",
"4432": "application/mac-binhex40",
"5842": "application/msword",
"1996": "application/octet-stream",
"5163": "application/oda",
"1282": "application/ogg",
"2316": "application/pdf",
"9733": "application/postscript",
"126": "application/rdf+xml",
"3590": "application/rss+xml",
"53": "application/rtf",
"6957": "application/vnd.apple.mpegurl",
"1581": "application/vnd.ms-excel",
"1281": "application/vnd.ms-fontobject",
"6619": "application/vnd.ms-powerpoint",
"3225": "application/vnd.oasis.opendocument.graphics",
"1222": "application/vnd.oasis.opendocument.presentation",
"5236": "application/vnd.oasis.opendocument.spreadsheet",
"375": "application/vnd.oasis.opendocument.text",
"6432": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
"5932": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
"9405": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
"383": "application/x-7z-compressed",
"4549": "application/x-abiword",
"1200": "application/x-bzip",
"3434": "application/x-bzip2",
"5221": "application/x-csh",
"3720": "application/x-freearc",
"122": "application/x-httpd-php",
"8667": "application/x-latex",
"6375": "application/x-midi",
"1420": "application/x-msexcel",
"5483": "application/x-msmetafile",
"1836": "application/x-msmoney",
"4276": "application/x-mspowerpoint",
"9443": "application/x-mspublisher",
"5572": "application/x-msschedule",
"3290": "application/x-msterminal",
"7286": "application/x-mswrite",
"1909": "application/x-netcdf",
"8987": "application/x-sh",
"3323": "application/x-shockwave-flash",
"4173": "application/x-silverlight",
"6260": "application/x-sql",
"7356": "application/x-tar",
"2044": "application/x-tcl",
"84": "application/x-tex",
"4331": "application/x-texinfo",
"1233": "application/x-ustar",
"3411": "application/x-wais-source",
"5320": "application/x-x509-ca-cert",
"7383": "application/x-xfig",
"2828": "application/x-xpinstall",
"18": "application/xhtml+xml",
"8579": "application/xml",
"2001": "application/zip",
"8351": "audio/3gpp",
"5685": "audio/3gpp2",
}

const contentTypes = [
    'application/andrew-inset',
    'application/atom+xml',
    'application/font-woff',
    'application/java-archive',
    'application/javascript',
    'application/json',
    'application/mac-binhex40',
    'application/msword',
    'application/octet-stream',
    'application/oda',
    'application/ogg',
    'application/pdf',
    'application/postscript',
    'application/rdf+xml',
    'application/rss+xml',
    'application/rtf',
    'application/vnd.apple.mpegurl',
    'application/vnd.ms-excel',
    'application/vnd.ms-fontobject',
    'application/vnd.ms-powerpoint',
    'application/vnd.oasis.opendocument.graphics',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-7z-compressed',
    'application/x-abiword',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-csh',
    'application/x-freearc',
    'application/x-httpd-php',
    'application/x-latex',
    'application/x-midi',
    'application/x-msexcel',
    'application/x-msmetafile',
    'application/x-msmoney',
    'application/x-mspowerpoint',
    'application/x-mspublisher',
    'application/x-msschedule',
    'application/x-msterminal',
    'application/x-mswrite',
    'application/x-netcdf',
    'application/x-sh',
    'application/x-shockwave-flash',
    'application/x-silverlight',
    'application/x-sql',
    'application/x-tar',
    'application/x-tcl',
    'application/x-tex',
    'application/x-texinfo',
    'application/x-ustar',
    'application/x-wais-source',
    'application/x-x509-ca-cert',
    'application/x-xfig',
    'application/x-xpinstall',
    'application/xhtml+xml',
    'application/xml',
    'application/zip',
    'application/x-cue',
    'application/applixware',
    'application/atomcat+xml',
    'application/ecmascript',
    'application/onenote',
    'application/pgp-encrypted',
    'audio/3gpp',
    'audio/3gpp2',
    'audio/aac',
    'audio/flac',
    'audio/midi',
    'audio/mp3',
    'audio/mp4',
    'audio/mpeg',
    'audio/ogg',
    'audio/webm',
    'audio/x-aac',
    'audio/x-aiff',
    'audio/x-midi',
    'audio/x-ms-wma',
    'audio/x-ms-wmv',
    'audio/x-wav',
    'audio/x-ape',
    'font/otf',
    'font/ttf',
    'font/woff',
    'font/woff2',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    'image/x-icon',
    'image/x-ms-bmp',
    'image/avif',
    'message/rfc822',
    'text/calendar',
    'text/css',
    'text/csv',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/xml',
    'text/x-log',
    'text/json',
    'video/3gpp',
    'video/3gpp2',
    'video/avi',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/quicktime',
    'video/webm',
    'video/x-flv',
    'video/x-m4v',
    'video/x-ms-asf',
    'video/x-ms-wmv',
    'video/x-msvideo',
    'video/x-matroska',
    'video/x-ms-wmv',
    'video/mp2t',
    'video/x-flv',
    'video/divx',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/wordperfect',
    'application/vnd.ms-works',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-word',
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/pjpeg',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/zip',
    'application/x-tar',
    'application/x-rar-compressed',
    'application/gzip',
    'application/x-7z-compressed',
    'application/x-bzip2'    
  ];