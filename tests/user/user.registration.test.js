import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer } from 'http';
import axios from 'axios';
import app from '../../src/app.js';
import UserEntity from '../../src/user/user.entity.js';
import sequelize from '../../src/config/database.js';
import console from 'node:console';
import userRepository from '../../src/user/user.repository.js';

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

const validUserInputs = {
  username: 'test',
  password: 'P4ssw0rd',
  email: 'test@test.com',
};

describe('User registration test', () => {
  it('should return hello world', async () => {
    const response = await axios.get(`${baseUrl}/`);

    expect(response.status).toBe(200);
    let responseText = response.data;
    expect(responseText).toBe('Hello World!');
  });

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
    let status;
    await postForUser({
      username: null,
      password: 'password',
      email: 'test@test.com',
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        status = error.response.status;
      }
    });
    expect(status).toBe(400);
  });

  it('should return validationErrors field in response body when validation error occurs', async () => {
    let data;
    await postForUser({
      username: null,
      password: 'password',
      email: 'test@test.com',
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        data = error.response.data;
      }
    });
    expect(data).toHaveProperty('validationErrors');
  });
});

describe('User input validation test', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  const usernameNull = 'Username is required';
  const usernameLength = 'Username must be between 4 and 32 characters long';
  const passwordNull = 'Password is required';
  const passwordLength = 'Password must be between 6 and 32 characters long';
  const passwordPattern =
    'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  const emailNull = 'Email is required';
  const emailInvalid = 'Email must be valid';
  const emailRegistered = 'Email is already registered';

  it.each`
    field         | value                  | expectedErrorMessage
    ${'username'} | ${null}                | ${usernameNull}
    ${'username'} | ${'usr'}               | ${usernameLength}
    ${'username'} | ${'u'.repeat(33)}      | ${usernameLength}
    ${'password'} | ${null}                | ${passwordNull}
    ${'password'} | ${'p'.repeat(5)}       | ${passwordLength}
    ${'password'} | ${'lowercase'}         | ${passwordPattern}
    ${'password'} | ${'UPPERCASE'}         | ${passwordPattern}
    ${'password'} | ${'UPPERandlowercase'} | ${passwordPattern}
    ${'email'}    | ${null}                | ${emailNull}
    ${'email'}    | ${'test.com'}          | ${emailInvalid}
  `(
    `should return error message: $expectedErrorMessage for field: $field with value: $value`,
    async ({ field, value, expectedErrorMessage }) => {
      const input = {
        username: 'test',
        password: 'P4ssword',
        email: 'test@test.com',
      };

      input[field] = value;
      let errorMessage;
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        errorMessage = validationErrors[0].msg;
      });
      console.log(errorMessage);
      expect(errorMessage).toBe(expectedErrorMessage);
    }
  );

  it('should return email is already registered when email is already registered', async () => {
    await userRepository.create(validUserInputs);
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      const validationErrors = error.response.data.validationErrors;
      errorMessage = validationErrors[0].msg;
    });
    expect(errorMessage).toBe(emailRegistered);
  });
});

describe('User input validation test in Chinese', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs, {
      headers: {
        'Accept-Language': 'zh',
      },
    });

  const usernameNull = '用户名是必需的';
  const usernameLength = '用户名长度必须在4到32个字符之间';
  const passwordNull = '密码是必需的';
  const passwordLength = '密码长度必须在6到32个字符之间';
  const passwordPattern =
    '密码必须包含至少一个大写字母、一个小写字母和一个数字';
  const emailNull = '邮箱是必需的';
  const emailInvalid = '邮箱必须是有效的';
  const emailRegistered = '邮箱已被注册';

  it.each`
    field         | value                  | expectedErrorMessage
    ${'username'} | ${null}                | ${usernameNull}
    ${'username'} | ${'usr'}               | ${usernameLength}
    ${'username'} | ${'u'.repeat(33)}      | ${usernameLength}
    ${'password'} | ${null}                | ${passwordNull}
    ${'password'} | ${'p'.repeat(5)}       | ${passwordLength}
    ${'password'} | ${'lowercase'}         | ${passwordPattern}
    ${'password'} | ${'UPPERCASE'}         | ${passwordPattern}
    ${'password'} | ${'UPPERandlowercase'} | ${passwordPattern}
    ${'email'}    | ${null}                | ${emailNull}
    ${'email'}    | ${'test.com'}          | ${emailInvalid}
  `(
    `should return error message: $expectedErrorMessage for field: $field with value: $value`,
    async ({ field, value, expectedErrorMessage }) => {
      const input = {
        username: 'test',
        password: 'P4ssword',
        email: 'test@test.com',
      };

      input[field] = value;
      let errorMessage;
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        errorMessage = validationErrors[0].msg;
      });
      console.log(errorMessage);
      expect(errorMessage).toBe(expectedErrorMessage);
    }
  );

  it(`should return message: ${emailRegistered} when email is already registered`, async () => {
    await userRepository.create(validUserInputs);
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      const validationErrors = error.response.data.validationErrors;
      errorMessage = validationErrors[0].msg;
    });
    expect(errorMessage).toBe(emailRegistered);
  });
});
