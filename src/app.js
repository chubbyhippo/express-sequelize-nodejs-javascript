import express from 'express';
import User from './user/user.js';
import bcrypt from 'bcrypt';
import console from 'console';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userToBeSaved = { ...req.body, password: hashedPassword };
  const user = await User.create(userToBeSaved);
  console.log(user);
  res.status(201);
  res.send({ message: 'User created' });
});

export default app;