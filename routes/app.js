var express = require('express');

var app = express();

app.get('/', (req, res, next) => {

    res.status(200).json({ mensaje: 'OK', ok: true });

});

module.exports = app;