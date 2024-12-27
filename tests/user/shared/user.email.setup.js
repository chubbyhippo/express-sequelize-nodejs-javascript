import { afterAll, beforeAll } from 'vitest';
import { SMTPServer } from 'smtp-server';
import console from 'node:console';

const emailServerPort = 2525;

let emailServer;
let lastMail;

beforeAll(async () => {
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
  await emailServer.listen(emailServerPort, 'localhost');
});

afterAll(async () => {
  await emailServer.close();
});

export { lastMail };
