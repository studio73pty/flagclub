const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const path = require('path');

//  @Descripcion    Buscar todos los eventos
//  @Ruta y Metodo  GET api/v1/eventos
//  @Acceso         Publica
exports.buscarEventos = asyncHandler( async (req, res, next) => {
    const eventos = await db('eventos').select();
    //  Organizandolos por fecha en que se hicieron
    eventos.sort(function(a,b){
        return new Date(b.fecha) - new Date(a.fecha);
      });
    
      res.status(200).json({
        success: true,
        count: eventos.length,
        data: eventos
    });
});

//  @Descripcion    Buscar un evento
//  @Ruta y Metodo  GET api/v1/eventos/:id
//  @Acceso         Publica
exports.buscarEvento = asyncHandler( async (req, res, next) => {
    const evento = await db('eventos').select().where({ id: req.params.id });
    if(evento.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el evento ' + req.params.id, 404))
    }
      res.status(200).json({
        success: true,
        data: evento
    })
});

//  @Descripcion    Crear un evento
//  @Ruta y Metodo  POST api/v1/blog/
//  @Acceso         Privada
exports.agregarEvento = asyncHandler(async (req, res, next) => {
    if(req.user[0].rol !== 'admin'){
        return next(new ErrorResponse('No tiene permiso para agregar un evento', 401))
    }
    const fecha = new Date();
    const { 
      nombre,
      intro,
      descripcion,
        } = req.body;
  
   const eventoId = await db('eventos').insert({
        nombre,
        intro,
        descripcion,
        fecha
    })

    const evento = await db('eventos').select().where({ id: eventoId })

    res.status(201).json({
        success: true,
        data: evento
    })
});

//  @Descripcion    Agrega una imagen al post
//  @Ruta y Metodo  PUT api/v1/eventos/:id/imagen
//  @Acceso         Privada
exports.subirImagenEvento = asyncHandler(async (req, res, next) => {
    if(req.user[0].rol !== 'admin'){
        return next(new ErrorResponse('No tiene permiso para modificar un evento', 401))
    }

    const post = await db('eventos').select().where({ id: req.params.id })

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
    file.name = `evento_foto_${post[0].id}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse('Problema subiendo el archivo', 500))
        }
        //  Guardando el nombre del archivo en la base de datos
        await db('eventos').where({id: req.params.id}).update({
            imagen: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})


//  @Descripcion    Modificar un evento
//  @Ruta y Metodo  PUT api/v1/evento/:id
//  @Acceso         Privada
exports.modificarEvento = asyncHandler(async (req, res, next) => {
    if(req.user[0].rol !== 'admin'){
        return next(new ErrorResponse('No tiene permiso para modificar un evento', 401))
    }
    const { 
      nombre,
      intro,
      descripcion,
        } = req.body;

    let post = await db('eventos').select().where({ id: req.params.id })

    if(post.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el post', 404))
    }
  
    await db('eventos').where({ id: req.params.id })
   .update({     
    nombre,
    intro,
    descripcion
    })

    post = await db('eventos').select().where({ id: req.params.id })

    res.status(200).json({
        success: true,
        data: post
    })
})


//  @Descripcion    Eliminar un evento
//  @Ruta y Metodo  DELETE api/v1/evento/:id
//  @Acceso         Privada
exports.eliminarEvento = asyncHandler(async (req, res, next) =>{
    if(req.user[0].rol !== 'admin'){
        return next(new ErrorResponse('No tiene permiso para eliminar un evento', 401))
    }
    await db('eventos').where({ id: req.params.id }).del();

    res.status(200).json({
        success: true,
    })
})
