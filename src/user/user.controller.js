import userService from './user.service.js';
import console from 'node:console';
import { userValidationRules, validate } from './user.validation.js';
import express from 'express';

const router = express.Router();

router.post(
  '/api/users',
  ...userValidationRules(),
  validate,
  async (req, res) => {
    try {
      await userService.createUser(req.body);
      res.status(201);
      // noinspection JSCheckFunctionSignatures
      res.send({ message: req.t('userCreated') });
    } catch (error) {
      res.status(502);
      console.error(error);
      // noinspection JSCheckFunctionSignatures
      res.send({ message: req.t(error.message) });
    }
  }
);
export default router;
