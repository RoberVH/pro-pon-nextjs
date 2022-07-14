import mongoose from 'mongoose'


const Companies = new mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  adminName: String,
  companyName: String,
  TaxPayerCompanyId: String,
  emailCompany: String,
  addressCompany: String,
  zip: String,
  telephone: String,
  city: String,
  state: String,
  country: String,
  website: String,
});

//module.exports = mongoose.model('empresas', Empresas);
module.exports = mongoose.models.Companies || mongoose.model('Companies', UserSchema)


