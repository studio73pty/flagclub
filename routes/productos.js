const express = require('express');

const {
    buscarProductos,
    buscarProducto,
    agregarProducto,
    subirImagenProducto,
    modificarProducto,
    eliminarProducto
} = require('../controllers/productos');

const router = express.Router();

router.route('/')
    .get(buscarProductos)
    .post(agregarProducto);
;

router.route('/:id')
    .get(buscarProducto)
    .put(modificarProducto)
    .delete(eliminarProducto)
;

router.route('/:id/imagen')
    .put(subirImagenProducto)
;

module.exports = router;