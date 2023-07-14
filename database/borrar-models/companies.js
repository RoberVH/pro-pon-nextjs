import mongoose from 'mongoose'


const Companies = new mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  adminName: String,
  companyName: String,
  TaxPayerCompanyId: String,
  emailCompany: String,
  website: String,
  country: String,
});

//module.exports = mongoose.model('empresas', Empresas);
//module.exports = mongoose.models.Companies || mongoose.model('Companies', Companies)
module.exports = mongoose.model('companies', Companies);


