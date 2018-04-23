var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var menuSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    url: { type: String, required: true },
    icon: { type: String, required: true },
    children: { type: Boolean, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Menu', required: false },
    rol: { type: String,required: false }
});
module.exports = mongoose.model('Menu', menuSchema);