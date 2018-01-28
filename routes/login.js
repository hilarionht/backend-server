var express = require('express');

var app = express();

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//var GoogleAuth = require('google-auth-library');

var SEED = require('../config/config').SEED;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;

const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

var Usuario = require('../models/usuario');

//============AUTENTICACION GOOGLE =================
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

app.post('/google', (req, res, next) => {

    var token = req.body.token || 'fff';
    // var client = new OAuth2(
    //     GOOGLE_CLIENT_ID,
    //     GOOGLE_SECRET,
    //     ''
    // );
    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');
    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {
            if (e) {
                return res.status(400).json({ mensaje: 'token no valido', ok: false, cliente: client });
            }
            var payload = login.getPayload();
            var userid = payload['sub'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al buscar usuario - login',
                        errors: err
                    });
                }
                if (usuario) {
                    if (usuario.google === false) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Debe usar su autenticacion normal.'
                        });
                    } else {
                        usuario.password = ':)';
                        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }) //4 horas
                        res.status(200).json({
                            ok: true,
                            usuario: usuario,
                            token: token,
                            id: usuario._id
                        });
                    }
                    //si usuario no existe por correo
                } else {
                    var usuario = new Usuario();
                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = '****';
                    usuario.img = payload.picture;
                    usuario.google = true;
                    usuario.save((err, usuarioSave) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'error al crear usuario - login',
                                errors: err
                            });
                        }
                        var token = jwt.sign({ usuario: usuarioSave }, SEED, { expiresIn: 14400 }) //4 horas
                        res.status(200).json({
                            ok: true,
                            usuario: usuarioSave,
                            token: token,
                            id: usuarioSave._id
                        });
                    });
                }
            });
            // If request specified a G Suite domain:
            //var domain = payload['hd'];
            //res.status(200).json({ mensaje: 'OK', ok: true, payload: payload });
        }
    );



});
//============AUTENTICACION GOOGLE =================



app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // CREAR TOKEN
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });

});
module.exports = app;