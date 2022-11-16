const Joi = require('joi');
const { objectId } = require('./custom.validation.js');

const createBook = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string().required(),
    author: Joi.string().required(),
    publisher: Joi.string().required(),
    language: Joi.string().required(),
    publicationDate: Joi.date().required(),
  }),
};

const getBookById = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
};

const updateBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().optional(),
    category: Joi.string().optional(),
    author: Joi.string().optional(),
    publisher: Joi.string().optional(),
    language: Joi.string().optional(),
    publicationDate: Joi.date().optional(),
  }),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createBook,
  getBookById,
  updateBook,
  deleteBook,
};
