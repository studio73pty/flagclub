const express = require('express');

const {
    buscarImagenes,
    buscarImagen,
    subirImagenGaleria,
    modificarImagenGaleria,
    eliminarImagen
} = require('../controllers/galeria');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(buscarImagenes)
    .post(protect, subirImagenGaleria)
;

router.route('/:id')
    .get(buscarImagen)
    .put(protect, modificarImagenGaleria)
    .delete(protect, eliminarImagen)
;

module.exports = router;