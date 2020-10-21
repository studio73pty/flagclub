const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const path = require('path');

//  @Descripcion    Buscar todos los blog posts
//  @Ruta y Metodo  GET api/v1/blog
//  @Acceso         Publica
exports.buscarPosts = asyncHandler( async (req, res, next) => {
    const posts = await db('blog').select();
    //  Organizandolos por fecha en que se hicieron
    posts.sort(function(a,b){
        return new Date(b.fecha) - new Date(a.fecha);
      });
    
      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    })
})

//  @Descripcion    Buscar un blog post
//  @Ruta y Metodo  GET api/v1/blog/:id
//  @Acceso         Publica
exports.buscarPost = asyncHandler( async (req, res, next) => {
    const post = await db('blog').select().where({ id: req.params.id });
    if(post.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el post', 404))
    }
      res.status(200).json({
        success: true,
        data: post
    })
});

//  @Descripcion    Crear un blog post
//  @Ruta y Metodo  POST api/v1/blog/
//  @Acceso         Privada
exports.agregarPost = asyncHandler(async (req, res, next) => {
    const fecha = new Date();
    const { 
      nombre,
      intro,
      contenido,
        } = req.body;
  
   const postId = await db('blog').insert({
        nombre,
        intro,
        contenido,
        fecha
    })

    const post = await db('blog').select().where({ id: postId })

    res.status(201).json({
        success: true,
        data: post
    })
})


//  @Descripcion    Agrega una imagen al post
//  @Ruta y Metodo  PUT api/v1/blog/:id/imagen
//  @Acceso         Privada
exports.subirImagenPost = asyncHandler(async (req, res, next) => {
    const post = await db('blog').select().where({ id: req.params.id })

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
    file.name = `foto_${post[0].id}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse('Problema subiendo el archivo', 500))
        }
        //  Guardando el nombre del archivo en la base de datos
        await db('blog').where({id: req.params.id}).update({
            imagen: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})

//  @Descripcion    Modificar un blog post
//  @Ruta y Metodo  PUT api/v1/blog/:id
//  @Acceso         Privada
exports.modificarPost = asyncHandler(async (req, res, next) => {
    const { 
      nombre,
      intro,
      contenido,
        } = req.body;

    let post = await db('blog').select().where({ id: req.params.id })

    if(post.length <= 0){
        return next(new ErrorResponse('No se ha conseguido el post', 404))
    }
  
    await db('blog').where({ id: req.params.id })
   .update({     
    nombre,
    intro,
    contenido
    })

    post = await db('blog').select().where({ id: req.params.id })

    res.status(200).json({
        success: true,
        data: post
    })
})


//  @Descripcion    Eliminar un blog post
//  @Ruta y Metodo  DELETE api/v1/blog/:id
//  @Acceso         Privada
exports.eliminarPost = asyncHandler(async (req, res, next) =>{
    await db('blog').where({ id: req.params.id }).del();

    res.status(200).json({
        success: true,
    })
})
