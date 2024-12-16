import express from 'express';
import userController from './UserController';

const router = express.Router();

router.post('/api/users', userController.createUser());

export default router;
