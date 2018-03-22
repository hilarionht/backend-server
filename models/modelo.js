var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modeloSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    marca: { type: Schema.Types.ObjectId, ref: 'Marca' },
    userMod: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaAlta: { type: Date, default: Date.now, required: true }
});
module.exports = mongoose.model('Modelo', modeloSchema);