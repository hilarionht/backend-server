//requires

var express = require('express');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
//inicializar variables
var app = express();
//CORS
app.use(cors());
// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     next();
// });

app.use("/api/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// app.all("/api/*", function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     console.log('in apiii');

//     return next();
// });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// importar rutas
var tipoProductoRoutes = require('./routes/tipoproducto');
var marcaRoutes = require('./routes/marca');
var modeloRoutes = require('./routes/modelo');
var productoRoutes = require('./routes/producto');
var personaRoutes = require('./routes/persona');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hopital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var searchRoute = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var appRoutes = require('./routes/app');
//rutas
app.use('/', express.static('dist', { redirect: false }));
app.use('/api/usuario', usuarioRoutes);
app.use('/api/tipo-producto', tipoProductoRoutes);
app.use('/api/marca', marcaRoutes);
app.use('/api/modelo', modeloRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/medico', medicoRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/search', searchRoute);
app.use('/api/upload', uploadRoutes);
app.use('/api/img', imagenesRoutes);
app.use('/api/', appRoutes);

app.get('*', function(req, res, next) {
    res.sendfile(path.resolve('dist/index.html'));
});

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