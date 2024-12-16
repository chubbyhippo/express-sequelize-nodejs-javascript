import express from 'express';
import userController from './UserController.js';

const router = express.Router();

router.post('/api/users', userController.createUser());

export default router;
