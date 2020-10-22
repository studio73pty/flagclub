const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { get } = require('http');

//  @Descripcion    Registro de usuarios
//  @Ruta y Metodo  POST api/v1/auth/registro
//  @Acceso         Publica
exports.register = asyncHandler(async (req, res, next) => {
    const { email, nombre, password, rol } = req.body;
    const hash = bcrypt.hashSync(password);
    const fecha = new Date();

    const validateEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    if(validateEmail(email)){
        const user = await  db('registro').insert({
            email,
            nombre,
            rol,
            hash,
            creado: fecha
        });
        
        const cliente = await db('registro').select().where({ id: user });

        if(cliente[0].rol == 'cliente'){
                await db('clientes').insert({
                id: cliente[0].id,
                nombre: cliente[0].nombre,
                email: cliente[0].email,
                creado: fecha
            })
        }
    
    const token = getSignedJwtToken(user);
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rolUsuario = await db('registro').select().where({ id: decoded.id[0] })

    res
    .status(200)
    .cookie('token', token, options)
    .json({
        success: true,
        rol: rolUsuario[0].rol,
        token
    })

    }else{
        return next(new ErrorResponse('Por favor ingresa un email valido', 400))
    }
})

//  @Descripcion    Inicio de sesion
//  @Ruta y Metodo  POST api/v1/auth/login
//  @Acceso         Publica
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;


    // Validando email y password
    if(!email || !password){
        return next(new ErrorResponse('Por favor ingresa un correo y contraseña', 400))
    }

    // Verificando si el usuario existe
    const user = await db.select().from('registro').where({ email })

    if(!user){
        return next(new ErrorResponse('Credenciales invalidas', 401))
    }

    // Comparando las contraseñas
    const isValid = bcrypt.compareSync(password, user[0].hash);

    if(!isValid){
        return next(new ErrorResponse('Credenciales invalidas', 401))
    }

    sendTokenResponse(user, 200, res)

})






//  Funcion de generacion de token
const getSignedJwtToken = (user) => {
    return jwt.sign({id: user},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}
//  Recibiendo el token de la BD, creando una cookie y enviando respuesta
const sendTokenResponse = async (user, statusCode, res) => {
    //  Creando el token
    const token = getSignedJwtToken(user);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        rol: decoded.id[0].rol,
        token
    })

}
