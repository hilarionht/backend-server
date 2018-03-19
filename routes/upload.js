var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Coleccion no es valida',
            errors: { message: 'Tipo de Coleccion no es valida' }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "Error loading files",
            errors: { message: 'debe seleccionar una imagen' }
        });
    }
    //obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo estas extenciones permitimos
    var extenisionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (extenisionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Error extension de archivos",
            errors: { message: 'debe seleccionar una imagen valida: ' + extenisionesValidas.join(', ') }
        });
    }
    //nombre de archivo personalizado

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: { message: 'Error al mover el archivo' }
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'peticion realizada correctamente',
        //     nombre: extensionArchivo
        // });
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    console.log();

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => { // en caso de error usar el mismo 
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el usuario con el id: ' + id + 'no existe ',
                    errors: { message: 'no existe un usario con ese id' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':(';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            })
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => { // en caso de error usar el mismo 
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "el medico con el id: " + id + "no existe ",
                    errors: { message: "no existe un usario con ese id" }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => { // en caso de error usar el mismo 
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "el hospital con el id: " + id + "no existe ",
                    errors: { message: "no existe un hospital con ese id" }
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    hospital: hospitalActualizado
                });
            })
        });
    }
    if (tipo === 'productos') {
        Producto.findById(id, (err, producto) => { // en caso de error usar el mismo 
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "el producto con el id: " + id + "no existe ",
                    errors: { message: "no existe un producto con ese id" }
                });
            }
            var pathViejo = './uploads/productos/' + producto.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            producto.img = nombreArchivo;
            producto.save((err, productoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    producto: productoActualizado
                });
            })
        });
    }

}

module.exports = app;