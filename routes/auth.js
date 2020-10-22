const express = require('express')

const {
    register,
    login
} = require('../controllers/auth');


const router = express.Router();

//  Middleware
const { protect } = require('../middleware/auth');

router.post('/registro', register);
router.post('/login', login);



module.exports = router;