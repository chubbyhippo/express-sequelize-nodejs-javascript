import express from 'express';
import UserController from './UserController.js';

const router = express.Router();
const userController = new UserController();

router.post('/api/users', userController.createUser());

export default router;
