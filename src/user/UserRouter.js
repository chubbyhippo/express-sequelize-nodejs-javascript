import UserEntity from './UserEntity.js';
import console from 'node:console';
import express from 'express';

const router = express.Router();

const createUser = () => async (req, res) => {
  const user = await UserEntity.create(req.body);
  console.log(user);
  res.status(201);
  res.send({ message: 'UserEntity created' });
};

router.post('/api/users', createUser());

export default router;

