const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//routing
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const path = require('path');

//connect to MongoDB
mongoose.connect('mongodb+srv://AlEx0709:zcv1FcZYZn0hAdR6@cluster0.kfwc86a.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//app.use(cors()); //  Middleware pour communiquer sur des domaines différents ??

app.use(bodyParser.json());

//Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;