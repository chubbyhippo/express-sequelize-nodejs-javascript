import request from 'supertest';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { createServer } from 'http';

import app from '../src/app';

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer(app);
  await server.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

afterAll(async () => {
  await server.close();
});

describe('User registration test', () => {
  it('should return hello world', async () => {
    const response = await fetch(`${baseUrl}/`);

    expect(response.status).toBe(200);
    let responseText = await response.text();
    expect(responseText).toBe('Hello World!');
  });

  it('should return status 200 when signup request is valid', async () => {

    const response = await request(app).post('/app/users')
      .send({
        username: 'test',
        email: 'test@test.com',
        password: 'password',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User created');
  });
});
