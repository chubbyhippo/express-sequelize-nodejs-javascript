import express from 'express';
import { userValidationRules, validate } from './user/user.validation.js';
import userController from './user/user.controller.js';

const router = express.Router();

router.post(
  '/api/users',
  ...userValidationRules(),
  validate,
  userController.createUser()
);

export default router;
