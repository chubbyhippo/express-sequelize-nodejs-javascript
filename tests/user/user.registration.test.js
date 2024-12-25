import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { createServer } from 'http';
import axios from 'axios';
import app from '../../src/app.js';
import UserEntity from '../../src/user/user.entity.js';
import sequelize from '../../src/config/database.js';
import console from 'node:console';
import nodemailerStub from 'nodemailer-stub';
import EmailService from '../../src/user/email.service.js';

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
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  it('should return status 201 when signup request is valid', async () => {
    const response = await postForUser(validUserInputs);

    expect(response.status).toBe(201);
  });

  it('should return success message when signup completed', async () => {
    const response = await postForUser(validUserInputs);

    expect(response.data.message).toBe('User has been created');
  });

  it('should return success message in Chinese when signup completed', async () => {
    const response = await axios.post(`${baseUrl}/api/users`, validUserInputs, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Language': 'zh',
        'Accept-Language': 'zh',
      },
    });

    expect(response.data.message).toBe('用户已创建');
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

  it('should create user in inactive mode', async () => {
    await postForUser(validUserInputs);
    const users = await UserEntity.findAll();
    expect(users[0].inactive).toBe(true);
  });

  it('should create user in inactive mode when request body contains inactive is false', async () => {
    await postForUser({ ...validUserInputs, inactive: false });
    const users = await UserEntity.findAll();
    expect(users[0].inactive).toBe(true);
  });

  it('should create an activationToken for user', async () => {
    await postForUser({ ...validUserInputs, inactive: false });
    const users = await UserEntity.findAll();
    expect(users[0].activationToken).toBeTruthy();
  });

  it('should send account activation email with activationToken', async () => {
    await postForUser(validUserInputs);
    const lastMail = nodemailerStub.interactsWithMail.lastMail();
    expect(lastMail.to[0]).toBe('test@test.com');
    const users = await UserEntity.findAll();
    let savedUser = users[0];
    expect(lastMail.content).toContain(savedUser.activationToken);
  });

  it('should return 502 when email sending have failed', async () => {
    const mockSendAccountActivationEmail = vi
      .spyOn(EmailService, 'sendAccountActivationEmail')
      .mockRejectedValue({
        message: 'Email sending have failed',
      });
    let status;
    await postForUser(validUserInputs).catch((error) => {
      if (error.response) {
        console.log(error.response);
        status = error.response.status;
      }
    });
    expect(status).toBe(502);

    mockSendAccountActivationEmail.mockRestore();
  });
});
