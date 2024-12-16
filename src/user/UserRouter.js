import UserEntity from './UserEntity.js';
import console from 'node:console';
import express from 'express';

const userRouter = express.Router();

userRouter.post('/api/users', async (req, res) => {
  const user = await UserEntity.create(req.body);
  console.log(user);
  res.status(201);
  res.send({ message: 'UserEntity created' });
});

export default userRouter;

