import express from 'express';
import User from './user.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/app/users', async (req, res) => {
  await User.create(req.body);
  res.send({ message: 'User created' });
});

export default app;