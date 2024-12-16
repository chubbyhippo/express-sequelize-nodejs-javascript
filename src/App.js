import express from 'express';
import userRouter from './user/UserRouter.js';
import console from 'node:console';
import process from 'node:process';

const app = express();

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log(`Environment: ${process.env.NODE_ENV}`);

export default app;
