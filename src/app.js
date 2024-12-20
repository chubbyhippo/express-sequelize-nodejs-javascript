import express from 'express';
import userRouter from './user/user.router.js';
import console from 'node:console';
import process from 'node:process';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      lookupHeader: 'accept-language', // must be lowercase
    },
  });

const app = express();

app.use(middleware.handle(i18next));

app.use(express.json());

app.use(userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log(`Environment: ${process.env.NODE_ENV}`);

export default app;
