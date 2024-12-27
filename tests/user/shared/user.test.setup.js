import { afterAll, beforeAll, beforeEach } from 'vitest';
import { createServer } from 'http';

let lastMail;
import app from '../../../src/app.js';
import sequelize from '../../../src/config/database.js';
import UserEntity from '../../../src/user/user.entity.js';
import { SMTPServer } from 'smtp-server';
import console from 'node:console';

let server;
let baseUrl;
let emailServer;

beforeAll(async () => {
  server = createServer(app);
  await server.listen(0);

  await sequelize.sync({ force: true });

  baseUrl = `http://localhost:${server.address().port}`;

  // noinspection JSUnusedGlobalSymbols
  emailServer = new SMTPServer({
    authOptional: true,
    onData: (stream, session, callback) => {
      let mailBody;
      stream.on('data', (chunk) => {
        console.log(chunk.toString());
        mailBody += chunk.toString();
      });
      stream.on('end', () => {
        lastMail = mailBody;
        callback();
      });
    },
  });
  await emailServer.listen(2525, 'localhost');
});

afterAll(async () => {
  await emailServer.close();
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

export { baseUrl, validUserInputs, lastMail };
