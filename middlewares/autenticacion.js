var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//veruficacion de token

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decodet) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token no valido',
                errors: err
            });
        }
        req.usuario = decodet.usuario;
        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decodet
        // });
    });
}