//requires
var express = require('express');
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/dbCollection', function(err, db) {
//     if (err) {
//         console.log('Unable to connect to the server. Please start the server. Error:', err);
//     } else {
//         console.log('Connected to Server successfully!');
//     }
// });
// mongoose.connect('mongodb://localhost:27017/test');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // we're connected!
// });
//inicializar variables
var app = express();

//rutas
app.get('/', (req, res, next) => {

    res.status(200).json({ mensaje: 'OK', ok: true });

});
//conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/angular', (err, res) => {

    if (err) throw err;
    console.log('base de datos corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'online');

});
//next continue con la siquiente instruccion
//app.listen escuchando peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});