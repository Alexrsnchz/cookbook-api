import request from 'supertest';
import createApp from '../indexTest.js';
import prisma from '../../prisma.js';

let server;
let app;

beforeAll(() => {
  // Creates a new server.
  app = createApp();
  // Listens on a random port.
  server = app.listen(0);
});

afterAll(async () => {
  // Closes prisma database connection.
  await prisma.$disconnect();
  // Closes test server.
  server.close();
});

describe('User HTTP requests', () => {
  const user = {
    username: 'Patata',
    email: 'patata@email.com',
    password: 'Password7_',
  };
  let userId;

  it('Registers a user', async () => {
    const res = await request(app).post('/api/users/register').send(user);
    userId = res.body.id;

    // Status code is 201.
    expect(res.statusCode).toBe(201);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, username, and email properties.
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('email', user.email);
    // Response headers contains a cookie.
    expect(res.headers['set-cookie']).toBeDefined();
    // Response cookie contains a token.
    const tokenCookie = res.headers['set-cookie'].find((cookie) =>
      cookie.startsWith('token=')
    );
    expect(tokenCookie).toBeDefined();
  });

  it('Logs in a user', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: user.email,
      password: user.password,
    });

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status, and message properties.
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'User logged in');
    // Response headers contains a cookie.
    expect(res.headers['set-cookie']).toBeDefined();
    // Response cookie contains a token.
    const tokenCookie = res.headers['set-cookie'].find((cookie) =>
      cookie.startsWith('token=')
    );
    expect(tokenCookie).toBeDefined();
  });

  it('Returns all users', async () => {
    const res = await request(app).get('/api/users');

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an array.
    expect(Array.isArray(res.body)).toBe(true);
    // Response body has at least one element.
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Returns a user by id', async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, username, and email properties.
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('Updates a user', async () => {
    const res = await request(app).patch(`/api/users/${userId}`).send({
      username: 'PatataPocha',
    });

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, username, and email properties.
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('username', 'PatataPocha');
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('Deletes a user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);

    // Status code is 204.
    expect(res.statusCode).toBe(204);
    // Response body is empty.
    expect(res.body).toEqual({});
  });

  it('Cannot register a user with invalid data', async () => {
    const res = await request(app).post('/api/users/register').send({
      username: 'A',
      email: 'aoe@',
      password: 'A',
    });

    // Status code is 400.
    expect(res.statusCode).toBe(400);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot register a user with an existing username/email', async () => {
    const res = await request(app).post('/api/users/register').send({
      username: 'Patroclo',
      email: 'patroclo@email.com',
      password: 'Password7_',
    });

    // Status code is 409.
    expect(res.statusCode).toBe(409);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot log in a user with non-existent data', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'non-existent@email.com',
      password: 'non-existent',
    });

    // Status code is 401.
    expect(res.statusCode).toBe(401);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot find the requested user', async () => {
    const res = await request(app).get('/api/users/99999');

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot find the requested user to update', async () => {
    const res = await request(app).patch('/api/users/99999').send({
      username: 'PatataPocha',
    });

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot find the requested user to delete', async () => {
    const res = await request(app).delete('/api/users/99999');

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });
});
