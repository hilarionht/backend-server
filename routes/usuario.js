var express = require('express');

var app = express();

var bcrypt = require('bcryptjs');

var SEED = require('../config/config').SEED;

const saltRounds = 10;

const myPlaintextPassword = 's0/\/\P4$$w0rD';

const someOtherPlaintextPassword = 'not_bacon';

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(myPlaintextPassword, salt);

var Usuario = require('../models/usuario');
// ========================================
//          Obtenere Todo los Usuarios
//=========================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error loading usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        })

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });

});
app.use('/', (req, res, next) => {

    var token = req.query.token;


});
// ========================================
//          agregar usuario nuevo
//=========================================
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error agregando usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });

});

// ========================================
//          actualizar usuario 
//=========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id: ' + id + 'no existe ',
                errors: { message: 'no existe un usario con ese id' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':(';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});
// ========================================
//          Eliminar un usuario por id 
//=========================================

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id: ' + id + 'no existe ',
                errors: { message: 'no existe un usario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
module.exports = app;