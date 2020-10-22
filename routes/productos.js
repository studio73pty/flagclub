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

const { protect } = require('../middleware/auth');

router.route('/')
    .get(buscarProductos)
    .post(protect, agregarProducto);
;

router.route('/:id')
    .get(buscarProducto)
    .put(protect, modificarProducto)
    .delete(protect, eliminarProducto)
;

router.route('/:id/imagen')
    .put(protect, subirImagenProducto)
;

module.exports = router;