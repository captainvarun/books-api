const { bookService } = require('../services');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError.js');
const catchErrors = require('../utils/catchErrors.js');

const createBook = async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(httpStatus.CREATED).send(book);
};

const getBooks = catchErrors(async (req, res) => {
  const book = await bookService.getBooks();
  res.send(book);
});

const getBook = catchErrors(async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);
  if (!book) throw new APIError(httpStatus.NOT_FOUND, 'Book not found');
  res.send(book);
});

const updateBook = catchErrors(async (req, res) => {
  await bookService.updateBookById(req.params.bookId, req.body);
  res.send(req.body);
});

const deleteBook = catchErrors(async (req, res) => {
  await bookService.deleteBookById(req.params.bookId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBook,
  getBook,
  getBooks,
  updateBook,
  deleteBook,
};
