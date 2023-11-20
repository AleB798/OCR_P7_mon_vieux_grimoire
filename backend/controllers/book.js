const Book = require('../models/book');

const fs = require('fs');

//POST (add new book)
exports.createBook = (req, res, next) => {

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { 
    res.status(201).json({ message: 'Livre enregistré avec succès !' });
  })
  .catch(error => { 
    res.status(400).json( { error });
  })
};

// POST (Rate a book)
exports.rateBook = (req, res, next) => {

  const grade = req.body.rating;
  const userId = req.auth.userId;
  const bookId = req.params.id;

  Book.findOne({ _id: bookId })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Check if the user has already rated the book
      const userRating = book.ratings.find(rating => rating.userId === userId);

      if (userRating) {
        return res.status(403).json({ message: 'Vous avez déjà évalué ce livre' });
      }

      // Add the new rating
      book.ratings.push({ userId, grade });

      // Update average rating
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);

      book.averageRating = parseFloat((sumRatings / totalRatings).toFixed(1));

      // Save the updated book
      return book.save();
    })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error });
    });
};

//GET
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    })
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
        res.status(200).json(books);
      })
    .catch((error) => {
        res.status(400).json({ error: error });
      });
};

//Selection of 3 best rated books
exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error: error });
    });
};

//PUT (Update a book)
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => 
                res.status(200).json({message : 'Livre modifié!'})
              )
              .catch(error => 
                res.status(401).json({ error })
              );
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//DELETE
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { 
                        res.status(200).json({message: 'Livre supprimé !'})
                      })
                      .catch(error => 
                        res.status(401).json({ error })
                      );
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

