import request from 'supertest';
import { it } from 'vitest';

import app from '../app';

it('should return status 200 when signup request is valid', () => {
  request(app).post('/app/users')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

});