import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer } from 'http';
import axios from 'axios';
import app from '../src/app';
import User from '../src/user.js';

let server;
let baseUrl;

beforeAll( async () => {
  server = createServer(app);
  await server.listen(0);

  baseUrl = `http://localhost:${server.address().port}`;
})

afterAll(async () => {
 server.close();
})

beforeEach(async () => {
  await User.sync({ force: true });
});

describe('User registration test', () => {
  it('should return hello world', async () => {
    const response = await axios.get(`${baseUrl}/`);

    expect(response.status).toBe(200);
    let responseText = response.data;
    expect(responseText).toBe('Hello World!');
  });

  it('should return status 200 when signup request is valid', async () => {
    const response = await axios.post(`${baseUrl}/app/users`, {
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    const responseBody = response.data;
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('User created');

    User.findAll().then(
      users => {
        expect(users.length).toBe(1);
      }
    )
  });
});
