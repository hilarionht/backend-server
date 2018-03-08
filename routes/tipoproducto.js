var express = require("express");

app = express();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../middlewares/autenticacion");

var TipoProducto = require("../models/tipoProducto");
// ========================================
//          Obtenere Todo los tipoProducto
//=========================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    TipoProducto.find({})
        .skip(desde)
        .limit(5)
        .exec((err, tipoProducto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error loading tipoProducto",
                    errors: err
                });
            }
            TipoProducto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    tipoProducto: tipoProducto,
                    total: conteo
                });
            });
        });

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });
});

// ========================================
//          agregar tipoProducto nuevo
//=========================================
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var tipoProducto = new TipoProducto({
        nombre: body.nombre,
        descripcion: body.descripcion
    });
    tipoProducto.save((err, tipoProductoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error agregando tipoProducto",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipoProducto: tipoProductoGuardado
        });
    });
});

// ========================================
//          actualizar tipoProducto
//=========================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    TipoProducto.findById(id, (err, tipoProducto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar tipoProducto",
                errors: err
            });
        }
        if (!tipoProducto) {
            return res.status(400).json({
                ok: false,
                mensaje: "el tipoProducto con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        tipoProducto.nombre = body.nombre;
        tipoProducto.usuario = req.usuario._id;
        tipoProducto.hospital = body.hospital;
        tipoProducto.modificado = req.usuario._id;
        tipoProducto.save((err, tipoProductoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error actualizando tipoProducto",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                tipoProducto: tipoProductoGuardado
            });
        });
    });
});
// ========================================
//          Eliminar un tipoProducto por id
//=========================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    TipoProducto.findByIdAndRemove(id, (err, tipoProductoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar tipoProducto",
                errors: err
            });
        }
        if (!tipoProductoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "el tipoProducto con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        res.status(200).json({
            ok: true,
            tipoProducto: tipoProductoBorrado
        });
    });
});
module.exports = app;