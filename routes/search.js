var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Marca = require('../models/marca');
var Modelo = require('../models/modelo');

var TipoProducto = require('../models/tipoproducto');
var Producto = require('../models/producto');
//busqueda por una collecion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'productos':
            promesa = buscarProductos(busqueda, regex);
            break;
        case 'marcas':
            promesa = buscarMarca(busqueda, regex);
            break;
        case 'buscarmarcas':
            promesa = buscarMarcaNombre(busqueda, regex);
            break;
        case 'modelos':
            promesa = buscarModelos(busqueda, regex);
            break;
        case 'modelosbyid':
            promesa = buscarModelosById(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'tipoproductos':
            promesa = buscarTipoProductos(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son: usuarios, medicos y hostpitales',
                error: { message: 'tipo de tabla/collecion no validos' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});
//busqueda general

app.get("/todo/:busqueda", (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(
        respuestas => {
            res.status(200).json({
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        }
    );
});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('modificado', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role').or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    });

}

function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Producto.find({ 'nombre': regex })
            // .populate('usuario', 'nombre email')
            .populate('tipoProducto')
            .exec((err, productos) => {
                if (err) {
                    reject('error al cargar productos', err);
                } else {
                    resolve(productos);
                }
            });
    });

}

function buscarMarca(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Marca.find({})
            .sort({ nombre: 1 })
            // .populate('usuario', 'nombre email')
            //.populate('tipoProducto')
            .exec((err, marcas) => {
                if (err) {
                    reject('error al cargar marcas', err);
                } else {
                    resolve(marcas);
                }
            });
    });

}

function buscarMarcaNombre(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Marca.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            //.populate('tipoProducto')
            .exec((err, marcas) => {
                if (err) {
                    reject('error al cargar marcas', err);
                } else {
                    resolve(marcas);
                }
            });
    });

}

function buscarModelos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Modelo.find({ nombre: regex })
            // .populate('usuario', 'nombre email')
            //.populate('tipoProducto')
            .exec((err, modelos) => {
                if (err) {
                    reject('error al cargar medicos', err);
                } else {
                    resolve(modelos);
                }
            });
    });

}

function buscarModelosById(busqueda, regex) {
    // console.log(regex);

    return new Promise((resolve, reject) => {
        Modelo.find({ marca: busqueda })
            .populate('marca', 'nombre')
            //.populate('tipoProducto')
            .exec((err, modelos) => {
                if (err) {
                    reject('error al cargar modelos', err);
                } else {
                    resolve(modelos);
                }
            });
    });

}

function buscarTipoProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        TipoProducto.find({ nombre: regex })
            .exec((err, tproductos) => {
                if (err) {
                    reject('error al cargar medicos', err);
                } else {
                    resolve(tproductos);
                }
            });
    });

}
module.exports = app;