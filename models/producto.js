var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'el nombre es requerido'] },
    descripcion: { type: String, required: false },
    marca: { type: Schema.Types.ObjectId, ref: 'Marca', required: false },
    tipoProducto: { type: Schema.Types.ObjectId, ref: 'TipoProducto', required: true },
    precioCompra: { type: Number, required: true },
    precioVenta: { type: Number, required: true },
    fechaUltimoPrecio: { type: Date, default: Date.now, required: true },
    cantidad: { type: Number, required: true },
    cantidadAdvertencia: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    userMod: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    modelo: { type: Schema.Types.ObjectId, ref: 'Modelo', required: false },
    img: { type: String, required: false }
});
module.exports = mongoose.model('Producto', productoSchema);