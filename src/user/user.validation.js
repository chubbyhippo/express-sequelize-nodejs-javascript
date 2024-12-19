import { body, validationResult } from 'express-validator';
import UserEntity from './user.entity.js';

const userValidationRules = () => [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Username must be between 4 and 32 characters long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6, max: 32 })
    .withMessage('Password must be between 6 and 32 characters long')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid')
    .bail()
    .custom(async (value) => {
      const user = await UserEntity.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email is already registered');
      }
      return true;
    }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ validationErrors: errors.array() });
  }
  next();
};
export { userValidationRules, validate };
