import { body, validationResult } from 'express-validator';
import userRepository from './user.repository.js';
import console from 'node:console';

const userValidationRules = () => [
  body('username')
    .notEmpty()
    .withMessage('usernameNull')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('usernameLength'),
  body('password')
    .notEmpty()
    .withMessage('passwordNull')
    .bail()
    .isLength({ min: 6, max: 32 })
    .withMessage('passwordLength')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .withMessage('passwordPattern'),

  body('email')
    .notEmpty()
    .withMessage('emailNull')
    .bail()
    .isEmail()
    .withMessage('emailInvalid')
    .bail()
    .custom(async (email) => {
      const user = await userRepository.findUserByEmail(email);
      if (user) {
        return Promise.reject('emailRegistered');
      }
      return true;
    }),
];

const validate = (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((error) => {
      console.log(error);
      console.log(req.t(error.msg));
      return (validationErrors[error['path']] = req.t(error.msg));
    });
    return res.status(400).send({ validationErrors: validationErrors });
  }
  next();
};
export { userValidationRules, validate };
