var express = require("express");

app = express();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../middlewares/autenticacion");

var Modelo = require("../models/modelo");

app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Modelo.findById(id)
            .exec((err, modelo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar modelo',
                        errors: err
                    });
                }

                if (!modelo) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El modelo con el id ' + id + 'no existe',
                        errors: { message: 'No existe un modelo con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    modelo: modelo
                });
            })
    })
    // ========================================
    //          Obtenere Todo los modelo
    //=========================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Modelo.find({})
        .sort({ nombre: 1 })
        // .skip(desde)
        //.limit(5)
        .populate('marca', 'nombre')
        .exec((err, modelo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error loading modelo",
                    errors: err
                });
            }
            Modelo.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    modelo: modelo,
                    total: conteo
                });
            });
        });

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });
});

// ========================================
//          agregar modelo nuevo
//=========================================
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var modelo = new Modelo({
        nombre: body.nombre,
        usuario: req.usuario._id,
        marca: body.marca
    });
    modelo.save((err, modeloGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error agregando modelo",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            modelo: modeloGuardado
        });
    });
});

// ========================================
//          actualizar modelo
//=========================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Modelo.findById(id, (err, modelo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar modelo",
                errors: err
            });
        }
        if (!modelo) {
            return res.status(400).json({
                ok: false,
                mensaje: "el modelo con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        modelo.nombre = body.nombre;
        modelo.usuario = req.usuario._id;

        modelo.save((err, modeloGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error actualizando modelo",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                modelo: modeloGuardado
            });
        });
    });
});
// ========================================
//          Eliminar un modelo por id
//=========================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Modelo.findByIdAndRemove(id, (err, modeloBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar modelo",
                errors: err
            });
        }
        if (!modeloBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "el modelo con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        res.status(200).json({
            ok: true,
            modelo: modeloBorrado
        });
    });
});
module.exports = app;