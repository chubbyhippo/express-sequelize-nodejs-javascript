import request from 'supertest';
import { describe, it, expect } from 'vitest';

import app from '../src/app';

describe('User registration test', () => {
  it('should return hello world', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
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
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User created');
  });
});
