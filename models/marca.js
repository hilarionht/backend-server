var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var marcaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El	nombre	es	necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    userMod: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaAlta: { type: Date, default: Date.now, required: true }
});
marcaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Marca', marcaSchema);