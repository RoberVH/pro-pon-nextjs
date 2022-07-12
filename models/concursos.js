const mongoose    = require('mongoose');


const Concursos = mongoose.Schema({

  _id           : mongoose.Schema.Types.ObjectId,
  guidConcursoA :  String,                          // id del sitio en Alfreso si existe
  cveConcurso   :  String,                          // Cve del concurso
  agencia       :  String,                          // id de Empresa del emisor del concurso (una agencia)
  name          :  String,                          // Nombre del Concurso
  startDate     :  Date,                            // Fecha de inicio de recepcion de propuestas
  endDate       :  Date,                            // Fecha de final de recepcion de propuestas
  openDate      :  Date,                            // Fecha de Apertura de propuestas
  bidders       :  [
                     {  idempresa: String,
                        guidCarpEmp: String}
                   ],                              // [Ids] de Todas las empresas que ofertaron
  winner        :  String,                          // Id del ganador
  open          :  Boolean,                         // Concurso esta abierto
  passwordCif   :  String,                          // Password para encriptar archivos, el passw essta cifrado con llave de ofertika
  ivValue       :  String                           // Initial vector del algoritomo de cifrado para el passwordCif
 },
 {timestamps: true}
);

module.exports = mongoose.model('concursos', Concursos);

