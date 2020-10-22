const express = require('express')
const {
    buscarEventos,
    buscarEvento,
    agregarEvento,
    subirImagenEvento,
    modificarEvento,
    eliminarEvento
} = require('../controllers/eventos');



const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(buscarEventos)
    .post(protect, agregarEvento)
;

router.route('/:id')
    .get(buscarEvento)
    .put(protect, modificarEvento)
    .delete(protect, eliminarEvento)
;

router.route('/:id/imagen').put(protect, subirImagenEvento)
;

module.exports = router;