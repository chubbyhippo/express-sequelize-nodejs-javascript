import express from 'express';
import console from 'node:console';
import process from 'node:process';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import userController from './user/user.controller.js';

// noinspection JSIgnoredPromiseFromCall
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
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

app.use(i18nextMiddleware.handle(i18next));

app.use(express.json());

app.use(userController);

console.log(`Environment: ${process.env.NODE_ENV}`);

export default app;
