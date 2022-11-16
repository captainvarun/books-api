const mongoose = require('mongoose');
const { Book } = require('../models/index.js');
const { v4: uuid } = require('uuid');

const createBook = async (bookBody) => {
  return await Book.create(bookBody);
};

const getBooks = async () => {
  return await Book.find({});
};

const getBookById = async (bookId) => {
  return await Book.findById(bookId);
};

const updateBookById = async (bookId, bookBody) => {
  return await Book.findByIdAndUpdate(bookId, bookBody);
};

const deleteBookById = async (bookId) => {
  return await Book.findByIdAndDelete(bookId);
};

module.exports = { createBook, getBookById, getBooks, updateBookById, deleteBookById };
