import request from 'supertest';
import { it, expect } from 'vitest';

import app from '../app';

it('should return hello world', async () => {
  const response = await request(app).get('/')
    .expect(200);
  expect(response.text).toBe('Hello World!');
});

it('should return status 200 when signup request is valid', async () => {
  const response = await request(app).post('/app/users')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    });
  expect(response.status).toBe(200);
});