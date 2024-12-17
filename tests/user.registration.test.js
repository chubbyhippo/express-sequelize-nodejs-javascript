import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer } from 'http';
import axios from 'axios';
import app from '../src/app.js';
import UserEntity from '../src/user/user.entity.js';
import sequelize from '../src/config/database.js';
import console from 'node:console';

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer(app);
  await server.listen(0);

  await sequelize.sync({ force: true });

  baseUrl = `http://localhost:${server.address().port}`;
});

afterAll(async () => {
  server.close();
});

beforeEach(async () => {
  await UserEntity.sync({ force: true });
});

describe('user registration test', () => {
  it('should return hello world', async () => {
    const response = await axios.get(`${baseUrl}/`);

    expect(response.status).toBe(200);
    let responseText = response.data;
    expect(responseText).toBe('Hello World!');
  });

  const validUserInputs = {
    username: 'test',
    password: 'password',
    email: 'test@test.com',
  };
  const createUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  it('should return status 201 when signup request is valid', async () => {
    const response = await createUser(validUserInputs);

    expect(response.status).toBe(201);
    const responseBody = response.data;
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('UserEntity created');
  });

  it('should save user to the database', async () => {
    await createUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users.length).toBe(1);
  });

  it('should save username and email to the database', async () => {
    await createUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users[0].username).toBe('test');
    expect(users[0].email).toBe('test@test.com');
  });

  it('should hash password in the database', async () => {
    await createUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users[0].password).not.toBe('password');
  });

  it('should return status 400 when username is null', async () => {
    createUser({
      username: null,
      password: 'password',
      email: 'test@test.com',
    }).catch((error) => {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        expect(error.response.status).toBe(400);
      }
    });
  });
});
