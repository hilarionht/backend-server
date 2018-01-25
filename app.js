//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
//inicializar variables
var app = express();


//body-parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// importar rutas
var personaRoutes = require('./routes/persona');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

//rutas
app.use('/persona', personaRoutes);

app.use('/usuario', usuarioRoutes);

app.use('/login', loginRoutes);

app.use('/', appRoutes);


// app.get('/', (req, res, next) => {

//     res.status(200).json({ mensaje: 'OK', ok: true });

// });



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