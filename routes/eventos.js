const express = require('express')
const {
    buscarEventos,
    buscarEvento,
    agregarEvento,
    subirImagenEvento,
    modificarEvento,
    eliminarEvento
} = require('../controllers/eventos');
const EliminarEvento = require('../controllers/eventos/EliminarEvento');


const router = express.Router();

router.route('/')
    .get(buscarEventos)
    .post(agregarEvento)
;

router.route('/:id')
    .get(buscarEvento)
    .put(modificarEvento)
    .delete(eliminarEvento)
;

router.route('/:id/imagen').put(subirImagenEvento)
;

module.exports = router;