var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'el nombre es requerido'] },
    descripcion: { type: String, required: false },
    tipoProducto: { type: Schema.Types.ObjectId, ref: 'TipoProducto', required: true },
    precioCompra: { type: Number, required: true },
    precioVenta: { type: Number, required: true },
    fechaUltimoPrecio: { type: Date, default: Date.now, required: true },
    cantidad: { type: Number, required: true },
    cantidadAdvertencia: { type: Number, required: true }
});
module.exports = mongoose.model('Producto', productoSchema);