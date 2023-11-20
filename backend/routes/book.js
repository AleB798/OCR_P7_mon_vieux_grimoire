const express = require('express');
const router = express.Router();

//Import Middelware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');

//Import Controller
const bookCtrl = require('../controllers/book');

// POST
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

//GET
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.get('/:id', bookCtrl.getOneBook);

//PUT
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

//DELETE
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;