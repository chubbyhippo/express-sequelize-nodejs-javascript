import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer } from 'http';
import axios from 'axios';
import app from '../../src/app.js';
import UserEntity from '../../src/user/user.entity.js';
import sequelize from '../../src/config/database.js';
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

describe('User registration test', () => {
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
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  it('should return status 201 when signup request is valid', async () => {
    const response = await postForUser(validUserInputs);

    expect(response.status).toBe(201);
    const responseBody = response.data;
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('UserEntity created');
  });

  it('should save user to the database', async () => {
    await postForUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users.length).toBe(1);
  });

  it('should save username and email to the database', async () => {
    await postForUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users[0].username).toBe('test');
    expect(users[0].email).toBe('test@test.com');
  });

  it('should hash password in the database', async () => {
    await postForUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users[0].password).not.toBe('password');
  });

  it('should return status 400 when username is null', async () => {
    await postForUser({
      username: null,
      password: 'password',
      email: 'test@test.com',
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        expect(error.response.status).toBe(400);
      }
    });
  });

  it('should return validationErrors field in response body when validation error occurs', async () => {
    await postForUser({
      username: null,
      password: 'password',
      email: 'test@test.com',
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        expect(error.response.data).toHaveProperty('validationErrors');
      }
    });
  });
});

describe('User input validation test', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  it.each([
    [
      { username: null, password: 'password', email: 'test@test.com' },
      'Username is required',
    ],
    [
      { username: 'username', password: null, email: 'test@test.com' },
      'Password is required',
    ],
    [
      { username: 'username', password: 'password', email: null },
      'Email is required',
    ],
    [
      { username: 'usr', password: 'password', email: null },
      'Username must be at least 4 characters long',
    ],
  ])(
    `should return validation error message for input %s, with message %s`,
    async (input, expectedError) => {
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        expect(validationErrors[0].msg).toBe(expectedError);
      });
    }
  );
});
