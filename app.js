//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
//inicializar variables
var app = express();
//CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// importar rutas
var personaRoutes = require('./routes/persona');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hopital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var searchRoute = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var appRoutes = require('./routes/app');
//
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));
//rutas
app.use('/persona', personaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoute);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/AngularDb', (err, res) => {

    if (err) throw err;
    console.log('base de datos corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'online');

});
//next continue con la siquiente instruccion
//app.listen escuchando peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});