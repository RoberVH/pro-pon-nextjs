// all errors labels coming from prop-pon smart contract
export const errorSmartContract = [
  "address_already_admin",
  "Insufficient_payment",
  "address_not_admin",
  "Only_owner_allow_withdraw",
  "Only_admin_can_perform",
  "insufficient_funds",
  "execution reverted: Insufficient_payment",
  "execution reverted: too_many_guests",
  "execution reverted: already_participating",
  "execution reverted: end_receiving_reached",
  // To Do: test and add custom error tags to locals gralerrors.json for each one
  "execution reverted: initial_date_wrong",
  "execution reverted: receiving_date_wrong",
  "execution reverted: wrong_contest_type",
  "execution reverted: not_open_tender",
  "execution reverted: max_participants_reached",
  "execution reverted: can_not_register_self",
  "execution reverted: not_participant",
  "execution reverted: issuer_bad_doctype,",
  "execution reverted: participant_bad_doctype",
  "execution reverted: too_many_winners",
  "execution reverted: not_matching_winners",
  "execution reverted: enddate_not_reached_yet",
  "execution reverted: cannot_self_award",
  "execution reverted: invalid_winner",
  "execution reverted: rfp_already_awarded",
  "execution reverted: id_already_exists",
  "execution reverted: rfpid_already_taken",
];

export const App_Name = 'Propon.me'

export const traslatedRFPErrors = [
    "notimetodownload", 
    "only_ownerrfp_doctpye", 
    "no_valid_docType",
    "no_valid_signature"
  ];


// Only  5 files each loading
export const MAX_FILES = process.env.NEXT_PUBLIC_MAX_FILES; //15

// Only  100 MB each loading
export const MAX_CAPACITY_FILES = process.env.NEXT_PUBLIC_MAX_CAPACITY_FILES; // 104_857_600

// Company Id (tax payer title) for countries
// value of property must have a corresponding entry on public/locales/signup.json file
export const companyIdPlaceHolder = {
  MEX: "mexicoCompanyId",
  COL: "colombiaCompanyId",
  CHL: "chileCompanyId",
};

// To easily reference this as an object instead of an array throughout the code I define a
// docTypes record as a numeric property identifying each category of document type referencing
// a docType record
// on this version of Propon.me (1.0) only documentProposalType document type is password protected, all others are public
export const docTypes = {
  // Doctypes for RFP Issuer
  0: {
    id: "0",
    type: "documentRequestType",
    desc: "request_doc",
    public: true,
  }, // RFP doc  from Owner
  1: { id: "1", type: "documentQandAType", desc: "q_a_doc", public: true}, // Clarification Questions and answers from Owner
  2: { id: "2", type: "documentAmendment", desc: "amend_doc", public: true}, // Contract, adenda, guaranties etc documents created between owner and winners
  // Doctypes for RFP Participant
  3: { id: "3", type: "documentProposalType", desc: "prop_doc", public: false}, // Technical offering, RFPs answers from participant
  4: {id: "4",type: "documentPricingOfferingType",desc: "pricing_doc",public: true}, // Economic Proposal from participant. It's password protected
  5: { id: "5", type: "documentLegalType", desc: "legal_doc", public: true }, // Legal documents from participants
  6: {id: "6",type: "documentFinancialType",desc: "financial_doc",public: true}, // Financial statements and documents from participants
  7: {id: "7",type: "documentAdministrativeType",desc: "admin_doc",public: true}, // Administrative documents from participants
};
// Also a IdxDocTypes is defined to better reference index of docTypes record
export const IdxDocTypes = {
  documentRequestType: 0,
  documentQandAType: 1,
  documentAmendment: 2,
  documentProposalType: 3,
  documentPricingOfferingType: 4,
  documentLegalType: 5,
  documentFinancialType: 6,
  documentAdministrativeType: 7,
};

// privateFileTypes ar document types that will be encrypted until end of receiving proposals is met, when they'll be public
// there will be a doctype that will never be public: the documentProposalType, that is the technical offering
export const privateFileTypes = [
  IdxDocTypes.documentProposalType,
  IdxDocTypes.documentPricingOfferingType,
  IdxDocTypes.documentLegalType,
  IdxDocTypes.documentFinancialType,
  IdxDocTypes.documentAdministrativeType,
];

export const openContest = 0;
export const inviteContest = 1;

//export const PRODUCTION = false;
//export const LOCAL = false;

export const NullAddress = "0x0000000000000000000000000000000000000000";
