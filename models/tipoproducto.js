var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tipoproductoSchema = new Schema({
    nombre: { type: String, required: [true, 'el nombre es requerido'] },
    descripcion: { type: String, required: [true, 'el dni es requerido'] }
});
module.exports = mongoose.model('TipoProducto', tipoproductoSchema);