var express = require('express');

var cors = require('cors');
//inicializar variables
var app = express();
//CORS
app.use(cors());

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Usuario = require('../models/usuario');
// ========================================
//          Obtenere Todo los Usuarios
//=========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    var limite = req.query.limite || 0;

    desde = Number(desde);
    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(limite)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error loading usuarios',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });

            })

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });

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
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
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