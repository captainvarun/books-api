const request = require('supertest');

const app = require('../app');
const { Book, User } = require('../models');
const { connectDB, disconnectDB } = require('../utils/mongo');

describe('Books', () => {
  let supertest;

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_TEST_URL);

    await request(app).post('/api/v1/auth/register').send({
      name: 'Varun',
      email: 'test@techvarun.com',
      password: 'varun123',
      role: 'admin',
    });

    const user = await request(app).post('/api/v1/auth/login').send({
      email: 'test@techvarun.com',
      password: 'varun123',
    });

    let token = user.body.tokens;

    supertest = new Proxy(request(app), {
      get:
        (target, name) =>
        (...args) => {
          return target[name](...args).set({
            Authorization: `bearer ${token.access.token}`,
            Accept: 'application/json',
          });
        },
    });
  });

  describe('POST Books', () => {
    test('should throw an error if user is unauthorized', async () => {
      const book = await request(app)
        .post('/api/v1/books')
        .send({
          title: 'Thinking, Fast and Slow',
          category: 'Business',
          author: 'Daniel Kahneman',
          publisher: 'Penguin',
          language: 'English',
          publicationDate: '2022-11-11T14:07:56.000Z',
        })
        .expect(401);

      expect(book.body).toStrictEqual({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should add book if the fields are valid', async () => {
      const book = await supertest
        .post('/api/v1/books')
        .send({
          title: 'Thinking, Fast and Slow',
          category: 'Business',
          author: 'Daniel Kahneman',
          publisher: 'Penguin',
          language: 'English',
          publicationDate: '2022-11-11T14:07:56.000Z',
        })
        .expect(201);
    });

    test('should throw an error if some fields are missing', async () => {
      const book = await supertest
        .post('/api/v1/books')
        .send({
          title: 'Thinking, Fast and Slow',
          category: 'Business',
          publisher: 'Penguin',
        })
        .expect(400);
    });

    afterAll(async () => {
      await Book.deleteMany({});
    });
  });

  describe('GET Books', () => {
    beforeAll(async () => {
      await supertest.post('/api/v1/books').send({
        title: 'Thinking, Fast and Slow',
        category: 'Business',
        author: 'Daniel Kahneman',
        publisher: 'Penguin',
        language: 'English',
        publicationDate: '2022-11-11T14:07:56.000Z',
      });

      await supertest.post('/api/v1/books').send({
        title: 'Thinking',
        category: 'Fiction',
        author: 'Ross',
        publisher: 'Roswald',
        language: 'English',
        publicationDate: '2022-11-11T14:07:56.000Z',
      });
    });

    test('should return atleast one book', async () => {
      const books = await request(app).get('/api/v1/books').expect(200);
      expect(books.body.length).toBeGreaterThan(1);
    });

    afterAll(async () => {
      await Book.deleteMany({});
    });
  });

  describe('GET Book', () => {
    let bookId;

    beforeAll(async () => {
      const response = await supertest.post('/api/v1/books').send({
        title: 'Thinking',
        category: 'Fiction',
        author: 'Ross',
        publisher: 'Roswald',
        language: 'English',
        publicationDate: '2022-11-11T14:07:56.000Z',
      });

      bookId = response.body.id;
    });

    test('should return one book having the given id', async () => {
      const book = await request(app).get(`/api/v1/books/${bookId}`).expect(200);
      expect(book.body).toEqual(
        expect.objectContaining({
          title: 'Thinking',
          category: 'Fiction',
          author: 'Ross',
          publisher: 'Roswald',
          language: 'English',
          publicationDate: '2022-11-11T14:07:56.000Z',
          id: expect.any(String),
        }),
      );
    });

    test('should return an error if book is not found', async () => {
      const book = await request(app).get(`/api/v1/books/6375108e5a4bcb90392b3a70`).expect(404);
      expect(book.body).toEqual({
        statusCode: 404,
        message: 'Book not found',
      });
    });

    test('should return an error if an invalid id is provided', async () => {
      const book = await request(app).get(`/api/v1/books/abcd`).expect(400);
      expect(book.body).toStrictEqual({
        statusCode: 400,
        message: '""bookId"" is invalid',
      });
    });

    afterAll(async () => {
      await Book.deleteMany({});
    });
  });

  describe('DELETE Books', () => {
    let bookId;

    beforeAll(async () => {
      const response = await supertest.post('/api/v1/books').send({
        title: 'Thinking',
        category: 'Fiction',
        author: 'Ross',
        publisher: 'Roswald',
        language: 'English',
        publicationDate: '2022-11-11T14:07:56.000Z',
      });

      bookId = response.body.id;
    });

    test('should return one book having the given id', async () => {
      const book = await supertest.delete(`/api/v1/books/${bookId}`).expect(204);
    });

    test('should return an error if an invalid id is provided', async () => {
      const book = await supertest.delete(`/api/v1/books/abcd`).expect(400);
      expect(book.body).toStrictEqual({
        statusCode: 400,
        message: '""bookId"" is invalid',
      });
    });

    afterAll(async () => {
      await Book.deleteMany({});
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await disconnectDB();
  });
});
