import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { createServer } from 'http';
import app from '../../../src/app.js';
import sequelize from '../../../src/config/database.js';
import UserEntity from '../../../src/user/user.entity.js';
import EmailService from '../../../src/user/email.service.js';

const serverPort = 0;

let server;
let baseUrl;
let mockSendAccountActivationEmail;

beforeAll(async () => {
  server = createServer(app);
  server.listen(serverPort);

  await sequelize.sync({ force: true });

  baseUrl = `http://localhost:${server.address().port}`;

  mockSendAccountActivationEmail = vi
    .spyOn(EmailService, 'sendAccountActivationEmail')
    .mockImplementation(() => Promise.resolve());

});

afterAll(async () => {
  mockSendAccountActivationEmail.mockRestore();
  server.close();
});

beforeEach(async () => {
  await UserEntity.sync({ force: true });
});

export { baseUrl };
