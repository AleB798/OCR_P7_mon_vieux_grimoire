const sharp = require('sharp');
const fs = require('fs').promises;

const compressImage = (req, res, next) => {
  if (req.file) {
    const name = req.file.filename.split('.')[0]; // Récupérer le nom du fichier sans l'extension
    const extension = 'webp';

    const newFilename = `${name}_${Date.now()}.${extension}`;

    sharp(req.file.path)
      .webp({ quality: 50 })
      .toFile(`images/${newFilename}`)
      .then(() => {
        return fs.unlink(req.file.path);
      })
      .then(() => {
        req.file.path = `images/${newFilename}`;
        req.file.filename = newFilename;
        req.file.mimetype = 'image/webp';
        console.log(req.file);

        next();
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Failed to compress image', error });
      });
  } else {
    next();
  }
};

module.exports = compressImage;
