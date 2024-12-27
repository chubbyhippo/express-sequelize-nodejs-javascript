import { afterAll, beforeAll, beforeEach } from 'vitest';
import { createServer } from 'http';
import app from '../../../src/app.js';
import sequelize from '../../../src/config/database.js';
import UserEntity from '../../../src/user/user.entity.js';

const serverPort = 0;

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer(app);
  await server.listen(serverPort);

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

export { baseUrl, validUserInputs };
