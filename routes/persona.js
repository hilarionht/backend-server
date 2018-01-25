var express = require('express');

var app = express();

var Persona = require('../models/persona');

app.get('/', (req, res, next) => {

    Persona.find({}, 'apellido nombre email img role').exec((err, persona) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error loading persona',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            personas: persona
        });
    })

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });

});

module.exports = app;