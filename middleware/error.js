const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // mostrando error en consola
    console.log(err)

    // Mongoose mal ObjectId
    if(err.name === 'CastError'){
        const message = `Recurso con id '${err.value}' no encontrado`;
        error = new ErrorResponse(message, 404)
    }

    // Mongoose campo duplicado
    if(err.code == 11000){
        const message = `El valor del campo ya existe, no puede ser duplicado`;
        error = new ErrorResponse(message, 400)
    }

    // Mongoose error de validacion
    if(err.name == 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400)
    }

    res
    .status(error.statusCode || 500)
    .json({
        success: false,
        error: error.message || 'Error del Servidor'
    })
}

module.exports = errorHandler;