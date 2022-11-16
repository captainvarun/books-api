const { connectDB, disconnectDB } = require('../utils/mongo');
const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

beforeAll(async () => {
  await connectDB(process.env.MONGODB_TEST_URL);
  await User.deleteMany({});
});

describe('POST /auth/register', () => {
  test('should return user on sucessful registration', async () => {
    const user = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Varun',
        email: 'varun@techvarun.com',
        password: 'varun123',
      })
      .expect(201);

    expect(user.body.user).toBeDefined();
    expect(user.body.user).toEqual(
      expect.objectContaining({
        name: 'Varun',
        email: 'varun@techvarun.com',
        role: 'user',
      }),
    );
    expect(user.body.token).toBeDefined();
  });

  test('should return error if email is taken', async () => {
    const user = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Varun',
        email: 'varun@techvarun.com',
        password: 'varun123',
      })
      .expect(400);

    expect(user.body).toStrictEqual({ statusCode: 400, message: 'Email already taken' });
  });

  test('should return error if credentials are missing', async () => {
    const user = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test',
        email: 'test@techvarun.com',
      })
      .expect(400);

    expect(user.body).toStrictEqual({ statusCode: 400, message: '"password" is required' });
  });
});

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Varun',
      email: 'varun@techvarun.com',
      password: 'varun123',
      role: 'admin',
    });
  });

  test('should return JWT token if user is valid', async () => {
    const user = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'varun@techvarun.com',
        password: 'varun123',
      })
      .expect(200);

    expect(user.body.user).toBeDefined();
    expect(user.body.user).toEqual(expect.not.objectContaining({ password: '' }));

    expect(user.body.tokens).toBeDefined();
    expect(user.body.tokens).toMatchObject({
      access: {
        token: expect.any(String),
        expires: expect.any(String),
      },
      refresh: {
        token: expect.any(String),
        expires: expect.any(String),
      },
    });
  });

  test('should return error if user credentials are incorrect', async () => {
    const user = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'varun@techvarun.com',
        password: 'tech',
      })
      .expect(401);

    expect(user.body).toStrictEqual({ statusCode: 401, message: 'Incorrect email or password' });
  });

  test('should return error if user credentials are missing', async () => {
    const user = await request(app).post('/api/v1/auth/login').send({}).expect(400);
    expect(user.body).toEqual({ statusCode: 400, message: '"email" is required, "password" is required' });
  });
});

afterAll(async () => {
  await disconnectDB();
});
