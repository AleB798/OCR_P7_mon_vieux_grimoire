const express = require('express');
const router = express.Router();

//Import Middelware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Import Controller
const bookCtrl = require('../controllers/book');

// POST
router.post('/', auth, multer, bookCtrl.createBook);
//router.post('/:id/rating', auth, bookCtrl.rateBook);

//GET
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);
//router.get('/bestrating', bookCtrl.getBestRatedBooks);

//PUT
router.put('/:id', auth, multer, bookCtrl.modifyBook);

//DELETE
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;