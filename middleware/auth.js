const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const db = require('../config/db');

// Protegiendo las rutas que necesiten de un token para accesarlas
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    //  Revisando que hayan Headers y esten formateados correctamente
    if(
        req.headers.authorization
        &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } /*
    else if(req.cookies.token){
        token = req.cookies.token
    }*/

    // Revisando que el token exista
    if(!token){
        return next(new ErrorResponse('No autorizado para acceder esta ruta', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // He tenido problemas asignando el usuario cuando se registra o inicia sesion, 
        //este IF valida si el usuario que inicio sesion fue por registro o login
        if(decoded.id[0].nombre){
            //  Se ejecuta este codigo si se ingreso por login
            req.user  = await db.select().from('registro').where({ id: decoded.id[0].id});

        }else{
            //  Se ejecuta este codigo si se ingreso por registro
            req.user  = await db.select().from('registro').where({ id: decoded.id[0]});
        }

        next();
    } catch (err) {
        return next(new ErrorResponse(err, 401))
    }
})
