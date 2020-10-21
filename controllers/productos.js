const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const path = require('path');

//  @Descripcion    Buscar todos los productos
//  @Ruta y Metodo  GET api/v1/productos
//  @Acceso         Publica
exports.buscarProductos= asyncHandler( async (req, res, next) => {
    const productos = await db('productos').select();
    //  Organizandolos por orden alfabetico
    productos.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
    })
      res.status(200).json({
        success: true,
        count: productos.length,
        data: productos
    })
});

//  @Descripcion    Buscar un producto
//  @Ruta y Metodo  GET api/v1/productos/:id
//  @Acceso         Publica
exports.buscarProducto = asyncHandler( async (req, res, next) => {
    const producto = await db('productos').select().where({ id: req.params.id });
    if(producto.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el producto ' + req.params.id, 404))
    }
      res.status(200).json({
        success: true,
        data: producto
    })
});


//  @Descripcion    Crear un producto
//  @Ruta y Metodo  POST api/v1/productos
//  @Acceso         Privada
exports.agregarProducto = asyncHandler(async (req, res, next) => {
    const fecha = new Date();
    const { 
        nombre,
        descripcion,
        precio,
        cantidad
          } = req.body;
  
   const productoId = await db('productos').insert({
        nombre,
        precio,
        descripcion,
        cantidad,
        fecha
    })

    const producto = await db('productos').select().where({ id: productoId })

    res.status(201).json({
        success: true,
        data: producto
    })
});

