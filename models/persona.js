var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var personaSchema = new Schema({
    apellido: { type: String, required: [true, 'el apellido es requerido'] },
    nombre: { type: String, required: [true, 'el nombre es requerido'] },
    dni: { type: String, required: [true, 'el dni es requerido'] },
    direccion: { type: String, required: false },
    email: { type: String, unique: true, required: [true, 'el correo es requerido'] },
    password: { type: String, required: [true, 'el password es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }
});
module.exports = mongoose.model('Persona', personaSchema);