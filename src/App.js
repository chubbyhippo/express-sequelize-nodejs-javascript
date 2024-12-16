import express from 'express';
import userRouter from './user/UserController.js';

const app = express();

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
