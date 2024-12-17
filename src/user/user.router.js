import express from 'express';
import { userValidationRules, validate } from './user.validation.js';
import userController from './user.controller.js';

const router = express.Router();

router.post(
  '/api/users',
  ...userValidationRules(),
  validate,
  userController.createUser()
);

export default router;
