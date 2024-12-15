import express from 'express';
import User from './user.js';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userToBeSaved = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
  }

  const user = await User.create(userToBeSaved);

  console.log(user);
  res.status(201);
  res.send({ message: 'User created' });
});

export default app;