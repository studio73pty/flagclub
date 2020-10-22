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

//  @Descripcion    Agrega una imagen al producto
//  @Ruta y Metodo  PUT api/v1/productos/:id/imagen
//  @Acceso         Privada
exports.subirImagenProducto = asyncHandler(async (req, res, next) => {
    const producto = await db('productos').select().where({ id: req.params.id })

    //  Comprobando si se subio un archivo
    if(!req.files){
        return next(new ErrorResponse('Por favor suba un archivo', 400))
    }
    

    //  Colocando el objeto de archivo en una variable
    const file = req.files.file;

    //  Comprobando si el archivo subido es ina imagen, sea JPG o PNG
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Por favor suba un archivo tipo imagen, PNG o JPG', 400))
    }

    //  Comprobando el tamaño del archivo
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Por favor suba un archivo inferior a ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    //  Crear el nombre del archivo personalizado
    file.name = `producto_foto_${producto[0].id}${producto[0].nombre}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse('Problema subiendo el archivo', 500))
        }
        //  Guardando el nombre del archivo en la base de datos
        await db('productos').where({id: req.params.id}).update({
            imagen: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})



//  @Descripcion    Modificar un producto
//  @Ruta y Metodo  PUT api/v1/productos/:id
//  @Acceso         Privada
exports.modificarProducto = asyncHandler(async (req, res, next) => {
    const { 
        nombre,
        descripcion,
        precio,
        cantidad
        } = req.body;

    let post = await db('productos').select().where({ id: req.params.id })

    if(post.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el post', 404))
    }
  
    await db('productos').where({ id: req.params.id })
   .update({     
    nombre,
    descripcion,
    precio,
    cantidad
    })

    post = await db('productos').select().where({ id: req.params.id })

    res.status(200).json({
        success: true,
        data: post
    })
})


//  @Descripcion    Eliminar un producto
//  @Ruta y Metodo  DELETE api/v1/producto/:id
//  @Acceso         Privada
exports.eliminarProducto = asyncHandler(async (req, res, next) =>{
    await db('productos').where({ id: req.params.id }).del();

    res.status(200).json({
        success: true,
    })
})
