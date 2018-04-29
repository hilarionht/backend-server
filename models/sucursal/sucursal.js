var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sucursalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    direccion: { type: String, required: [true, 'La direccion es requerido'] },
    telefono: { type: String, required: [true, 'el nombre es requerido'] },
    fechaAlta: { type: String, required: [true, 'el dni es requerido'] },
    activo: { type: String, required: false },
});
module.exports = mongoose.model('Sucursal', sucursalSchema);