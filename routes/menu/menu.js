
var express = require("express");

app = express();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../../middlewares/autenticacion");

var Menu = require("../../models/menu/menu");


app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Menu.findById(id)
            .exec((err, menu) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar menu',
                        errors: err
                    });
                }

                if (!menu) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El menu con el id ' + id + 'no existe',
                        errors: { message: 'No existe un menu con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    menu: menu
                });
            })
    })
    // ========================================
    //          Obtenere Todo los menu
    //=========================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    var limite = req.query.limite || 0;

    desde = Number(desde);
    limite = Number(limite);
    Menu.find({})
        .sort({ nombre: 1 })
        .skip(desde)
        .limit(limite)

    .exec((err, menu) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error loading menu",
                errors: err
            });
        }
        Menu.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                menu: menu,
                total: conteo
            });
        });
    });

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });
});

// ========================================
//          agregar menu nuevo
//=========================================
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var menu = new Menu({
        nombre: body.nombre,
        url: body.url,
        icon: body.icon,
        children: body.children,
        parent: body.parent,
        rol: body.rol
    });
    menu.save((err, menuGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error agregando menu",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            menu: menuGuardado
        });
    });
});

// ========================================
//          actualizar menu
//=========================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Menu.findById(id, (err, menu) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar menu",
                errors: err
            });
        }
        if (!menu) {
            return res.status(400).json({
                ok: false,
                mensaje: "el menu con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        menu.nombre = body.nombre.toUpperCase();
        menu.usuario = req.usuario._id;

        menu.save((err, menuGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error actualizando menu",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                menu: menuGuardado
            });
        });
    });
});
// ========================================
//          Eliminar un menu por id
//=========================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Menu.findByIdAndRemove(id, (err, menuBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar menu",
                errors: err
            });
        }
        if (!menuBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "el menu con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        res.status(200).json({
            ok: true,
            menu: menuBorrado
        });
    });
});
module.exports = app;