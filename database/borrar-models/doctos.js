const mongoose    = require('mongoose');


const Doctos = mongoose.Schema({

  _id           : mongoose.Schema.Types.ObjectId,
  cveConcurso   :  String,
  username      :  String,
  idEmpresa     :  String,
  hash          :  String,
  nameFile      :  String,
  docType       :  String,
  guiAlfDoc     :  String
 },
 {timestamps: true}
);

module.exports = mongoose.model('doctos', Doctos);

 