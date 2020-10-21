const express = require('express');

const {
    buscarProductos,
    buscarProducto,
    agregarProducto
} = require('../controllers/productos');

const router = express.Router();

router.route('/')
    .get(buscarProductos)
    .post(agregarProducto);
;

router.route('/:id')
    .get(buscarProducto)
;

module.exports = router;