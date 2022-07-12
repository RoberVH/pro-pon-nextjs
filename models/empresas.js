const mongoose    = require('mongoose');


const Empresas = mongoose.Schema({

  _id           : mongoose.Schema.Types.ObjectId,
  idEmpresa     :  String,
  guidAlf       :  String,
  addCtoEmp     :  String,
  nombreEmpresa :  String,
  contacto      :  String,
  telefono      :  String,
  email         :  String,
  clave         :  String,
  giro          :  String,
  url           :  String,
  certificada   :  Boolean,
  inhabilitada  :  Boolean,
  agencia       :  {type    : Boolean,
                    default : 'false'}},
  {timestamps: true}                  
);

module.exports = mongoose.model('empresas', Empresas);

