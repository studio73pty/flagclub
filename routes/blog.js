const express = require('express');
const{
    buscarPosts,
    buscarPost,
    agregarPost,
    subirImagenPost,
    modificarPost,
    eliminarPost
} = require('../controllers/blog');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(buscarPosts)
    .post(protect, agregarPost);

router.route('/:id')
    .get(buscarPost)
    .put(protect, modificarPost)
    .delete(protect, eliminarPost)

router.route('/:id/imagen').put(protect, subirImagenPost)

module.exports = router;