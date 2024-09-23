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

describe('Recipe HTTP requests', () => {
  const recipe = {
    name: 'Pasta alla bolognese',
    description: 'Italian pasta with lots of tomatoes',
    ingredients: ['Pasta', 'Tomatoes', 'Salt'],
    steps: ['Boil water', 'Add salt', 'Cook the pasta', 'Add the tomatoes'],
    authorId: 1,
  };
  let recipeId;

  it('Adds a recipe', async () => {
    const res = await request(app).post('/api/recipes').send(recipe);
    recipeId = res.body.id;

    // Status code is 201.
    expect(res.statusCode).toBe(201);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, name, description, ingedients,
    // and steps properties.
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', recipe.name);
    expect(res.body).toHaveProperty('description', recipe.description);
    expect(res.body).toHaveProperty('ingredients', recipe.ingredients);
    expect(res.body).toHaveProperty('steps', recipe.steps);
  });

  it('Returns all recipes', async () => {
    const res = await request(app).get('/api/recipes');

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an array.
    expect(Array.isArray(res.body)).toBe(true);
    // Response body has at least one element.
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Returns a recipe by id', async () => {
    const res = await request(app).get(`/api/recipes/${recipeId}`);

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, name, description, ingedients,
    // and steps properties.
    expect(res.body).toHaveProperty('id', recipeId);
    expect(res.body).toHaveProperty('name', recipe.name);
    expect(res.body).toHaveProperty('description', recipe.description);
    expect(res.body).toHaveProperty('ingredients', recipe.ingredients);
    expect(res.body).toHaveProperty('steps', recipe.steps);
  });

  it('Updates a recipe', async () => {
    const res = await request(app).patch(`/api/recipes/${recipeId}`).send({
      name: 'Fantastic pasta',
    });

    // Status code is 200.
    expect(res.statusCode).toBe(200);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has id, name, description, ingedients,
    // and steps properties.
    expect(res.body).toHaveProperty('id', recipeId);
    expect(res.body).toHaveProperty('name', 'Fantastic pasta');
    expect(res.body).toHaveProperty('description', recipe.description);
    expect(res.body).toHaveProperty('ingredients', recipe.ingredients);
    expect(res.body).toHaveProperty('steps', recipe.steps);
  });

  it('Deletes a recipe', async () => {
    const res = await request(app).delete(`/api/recipes/${recipeId}`);

    // Status code is 204.
    expect(res.statusCode).toBe(204);
    // Response body is empty.
    expect(res.body).toEqual({});
  });

  //   it('Cannot add a recipe with invalid data', async () => {
  //     const res = await request(app).post('/api/recipes').send({
  //       username: 'A',
  //       email: 'aoe@',
  //       password: 'A',
  //     });

  //     // Status code is 400.
  //     expect(res.statusCode).toBe(400);
  //     // Response body is an object.
  //     expect(res.body).toBeInstanceOf(Object);
  //     // Response body has status and message properties.
  //     expect(res.body).toHaveProperty('status', 'error');
  //     expect(res.body).toHaveProperty('message');
  //   });

  it('Cannot find the requested recipe', async () => {
    const res = await request(app).get('/api/recipes/99999');

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot find the requested recipe to update', async () => {
    const res = await request(app).patch('/api/recipes/99999').send({
      name: 'Patata pocha',
    });

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });

  it('Cannot find the requested recipe to delete', async () => {
    const res = await request(app).delete('/api/recipes/99999');

    // Status code is 404.
    expect(res.statusCode).toBe(404);
    // Response body is an object.
    expect(res.body).toBeInstanceOf(Object);
    // Response body has status and message properties.
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message');
  });
});
