const mongoose    = require('mongoose');


const User = mongoose.Schema({
  _id:        mongoose.Schema.Types.ObjectId,
  username:       String,
  password:       String,
  Pbk:            String,
  email:          String,
  idEmpresa:      String,
  nombreEmpresa:  String,
 },
 {timestamps: true}
);

module.exports = mongoose.model('users', User);

 