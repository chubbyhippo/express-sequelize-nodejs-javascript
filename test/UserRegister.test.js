import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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
    const response = await fetch(`${baseUrl}/app/users`, {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json', // Send JSON data
      },
      body: JSON.stringify({
        username: 'test',
        email: 'test@test.com',
        password: 'password',
      }),
    });

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('User created');
  });
});
