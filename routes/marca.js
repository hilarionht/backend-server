var express = require("express");

app = express();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../middlewares/autenticacion");

var Marca = require("../models/marca");


app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Marca.findById(id)
            .exec((err, marca) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar marca',
                        errors: err
                    });
                }

                if (!marca) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El marca con el id ' + id + 'no existe',
                        errors: { message: 'No existe un marca con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    marca: marca
                });
            })
    })
    // ========================================
    //          Obtenere Todo los marca
    //=========================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Marca.find({})
        .sort('nombre')
        .skip(desde)
        .limit(5)

    .exec((err, marca) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error loading marca",
                errors: err
            });
        }
        Marca.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                marca: marca,
                total: conteo
            });
        });
    });

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });
});

// ========================================
//          agregar marca nuevo
//=========================================
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var marca = new Marca({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    marca.save((err, marcaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error agregando marca",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            marca: marcaGuardado
        });
    });
});

// ========================================
//          actualizar marca
//=========================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Marca.findById(id, (err, marca) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar marca",
                errors: err
            });
        }
        if (!marca) {
            return res.status(400).json({
                ok: false,
                mensaje: "el marca con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        marca.nombre = body.nombre;
        marca.usuario = req.usuario._id;

        marca.save((err, marcaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error actualizando marca",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                marca: marcaGuardado
            });
        });
    });
});
// ========================================
//          Eliminar un marca por id
//=========================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Marca.findByIdAndRemove(id, (err, marcaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar marca",
                errors: err
            });
        }
        if (!marcaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "el marca con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        res.status(200).json({
            ok: true,
            marca: marcaBorrado
        });
    });
});
module.exports = app;