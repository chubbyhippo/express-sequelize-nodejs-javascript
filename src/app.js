import express from 'express';
import User from './user/user.js';
import console from 'node:console';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  console.log(user);
  res.status(201);
  res.send({ message: 'User created' });
});

export default app;
