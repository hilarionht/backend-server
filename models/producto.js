var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'el nombre es requerido'] },
    descripcion: { type: String, required: false },
    tipo: { type: Schema.Types.ObjectId, ref: 'TipoProducto', required: true },
    precioCompra: { type: number, required: true },
    precioVenta: { type: number, required: true },
    fechaUltimoPrecio: { type: Date, required: true },
    cantidad: { type: number, required: true },
    cantidadAdvertencia: { type: number, required: true },
});
module.exports = mongoose.model('Producto', productoSchema);