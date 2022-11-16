const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.js');

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

booksSchema.plugin(toJSON);

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
