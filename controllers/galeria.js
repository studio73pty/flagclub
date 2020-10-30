const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const path = require('path');

//  @Descripcion    Buscar todas las imagenes
//  @Ruta y Metodo  GET api/v1/galeria
//  @Acceso         Publica
exports.buscarImagenes= asyncHandler( async (req, res, next) => {
    const imagenes = await db('galeriaImg').select();
        //  Organizandolos por fecha en que se hicieron
        imagenes.sort(function(a,b){
          return new Date(b.creado) - new Date(a.creado);
        });
      res.status(200).json({
        success: true,
        count: imagenes.length,
        data: imagenes
    });
})

//  @Descripcion    Buscar una imagen de la galeria
//  @Ruta y Metodo  GET api/v1/galeria/:id
//  @Acceso         Publica
exports.buscarImagen= asyncHandler( async (req, res, next) => {
    const imagen = await db('galeriaImg').select().where({ id: req.params.id })
      res.status(200).json({
        success: true,
        data: imagen
    });
})


//  @Descripcion    Agrega una imagen a la galeria
//  @Ruta y Metodo  POST api/v1/galeria
//  @Acceso         Privada
exports.subirImagenGaleria = asyncHandler(async (req, res, next) => {
  if(req.user[0].rol !== 'admin'){
      return next(new ErrorResponse('No tiene permiso para agregar una imagen a la galeria', 401))
  }
  
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
  file.name = `galeria_imagen_${Date.now()}${path.parse(file.name).ext}`
  
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if(err){
          console.error(err);
          return next(new ErrorResponse('Problema subiendo el archivo', 500))
      }
      //  Guardando el nombre del archivo en la base de datos
        const imagenId = await db('galeriaImg').insert({
          imagen: file.name,
          creado: new Date()
      })

      const imagen = await db('galeriaImg').select().where({ id: imagenId })


      res.status(200).json({
          success: true,
          data: imagen
      })
  })
})

//  @Descripcion    Modificar una imagen de la galeria
//  @Ruta y Metodo  PUT api/v1/galeria/:id
//  @Acceso         Privada
exports.modificarImagenGaleria = asyncHandler(async (req, res, next) => {
  if(req.user[0].rol !== 'admin'){
      return next(new ErrorResponse('No tiene permiso para modificar una imagen', 401))
  }
  let imagen = await db('galeriaImg').select().where({ id: req.params.id })

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
  file.name = `galeria_imagen_${imagen[0].id}${Date.now()}${path.parse(file.name).ext}`
  
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if(err){
          console.error(err);
          return next(new ErrorResponse('Problema subiendo el archivo', 500))
      }
      //  Guardando el nombre del archivo en la base de datos
      await db('galeriaImg').where({id: req.params.id}).update({
          imagen: file.name
      })

      imagen = await db('galeriaImg').select().where({ id: req.params.id })

      res.status(200).json({
          success: true,
          data: imagen
      })
  })
})


//  @Descripcion    Modificar una imagen de la galeria
//  @Ruta y Metodo  PUT api/v1/galeria/:id
//  @Acceso         Privada
exports.eliminarImagen = asyncHandler(async (req, res, next) => {
  if(req.user[0].rol !== 'admin'){
    return next(new ErrorResponse('No tiene permiso para eliminar una imagen', 401))
}
await db('galeriaImg').where({ id: req.params.id }).del();

res.status(200).json({
    success: true,
  })
})