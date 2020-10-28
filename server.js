const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const mysql = require('mysql');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

require('dotenv').config();

//Llamando controladores


//--- usuario
const registro = require('./controllers/usuario/Registro');
const inicioSesion = require('./controllers/usuario/IniciarSesion');

//--- productos
const buscarProductos = require('./controllers/productos/HomeProductos');
const buscarProducto = require('./controllers/productos/BuscarProducto');
const modificarProducto = require('./controllers/productos/ModificarProducto');
const borrarProducto = require('./controllers/productos/EliminarProducto');

// Llamando a Uploads y Cloudinary
const upload = require('./controllers/ImageUploader/Multer');
const cloudinary = require('./controllers/ImageUploader/Cloudinary');


//  Llamando al router
const blog = require('./routes/blog');
const eventos = require('./routes/eventos');
const productos = require('./routes/productos');
const auth = require('./routes/auth');

const app = express();

  // Middleware
  app.use(express.json());
  //  Cookie Parser


  app.use(cors({origin: '*'}));
  
  if(process.env.NODE_ENV === 'development'){
      app.use(morgan('dev'));
  }


  //  File Upload
app.use(fileupload());
  //  Creando la carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));


// ----------  Inicio de endpoints
app.get('/', (req, res) => {res.json('deporte vivo!')});

//---- Blog
app.use('/api/v1/blog', blog);

//---- Eventos
app.use('/api/v1/eventos', eventos);

//---- Productos
app.use('/api/v1/productos', productos);

//---- Auth
app.use('/api/v1/auth', auth);






app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${process.env.PORT}`.cyan.bold)
);

// Gestionando unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR con BD: ${err.message}`.red.bgWhite)
    // Cerrar el servidor y salir del proceso (que la app no corra)
    server.close(() => {
        process.exit(1)
    })
})

    