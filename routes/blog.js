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

router.route('/')
    .get(buscarPosts)
    .post(agregarPost);

router.route('/:id')
    .get(buscarPost)
    .put(modificarPost)
    .delete(eliminarPost)

router.route('/:id/imagen').put(subirImagenPost)

module.exports = router;