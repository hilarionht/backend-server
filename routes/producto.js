var express = require("express");

app = express();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../middlewares/autenticacion");

var Producto = require("../models/producto");
// ========================================
//          Obtenere Todo los producto
//=========================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({})
        .skip(desde)
        .limit(5)

    .populate("tipoProducto", "nombre")

    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error loading producto",
                errors: err
            });
        }
        Producto.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                productos: productos,
                total: conteo
            });
        });
    });

    //res.status(200).json({ mensaje: 'Get de usuarios!', ok: true });
});
// ==========================================
//  Obtener Producto por ID
// ==========================================
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Producto.findById(id)
            .populate('tipoProducto', 'nombre descripcion')
            .exec((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar producto',
                        errors: err
                    });
                }

                if (!producto) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El producto con el id ' + id + 'no existe',
                        errors: { message: 'No existe un producto con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    producto: producto
                });
            })
    })
    // ========================================
    //          agregar producto nuevo
    //=========================================
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        tipoProducto: body.tipoProducto,
        cantidad: body.cantidad,
        precioCompra: body.precioCompra,
        precioVenta: body.precioVenta,
        cantidadAdvertencia: body.cantidadAdvertencia,
        descripcion: body.descripcion,
        marca: body.marca,
        modelo: body.modelo,
        usuario: req.usuario._id
    });
    producto.save((err, productoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error agregando producto",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoGuardado
        });
    });
});

// ========================================
//          actualizar producto
//=========================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar producto",
                errors: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: "el producto con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        producto.nombre = body.nombre;
        producto.tipoProducto = body.tipoProducto;
        producto.cantidad = body.cantidad;
        producto.precioCompra = body.precioCompra;
        producto.precioVenta = body.precioVenta;
        producto.cantidadAdvertencia = body.cantidadAdvertencia;
        producto.descripcion = body.descripcion;
        producto.marca = body.marca;
        producto.modelo = body.modelo;
        producto.userMod = req.usuario._id;
        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error actualizando producto",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});
// ========================================
//          Eliminar un producto por id
//=========================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, tipoProductoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar producto",
                errors: err
            });
        }
        if (!tipoProductoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "el producto con el id: " + id + "no existe ",
                errors: { message: "no existe un usario con ese id" }
            });
        }
        res.status(200).json({
            ok: true,
            producto: tipoProductoBorrado
        });
    });
});
module.exports = app;