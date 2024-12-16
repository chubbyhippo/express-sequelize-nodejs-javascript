import User from './user.js';
import console from 'node:console';
import express from 'express';

const router = express.Router();

router.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  console.log(user);
  res.status(201);
  res.send({ message: 'User created' });
});

export default router;

