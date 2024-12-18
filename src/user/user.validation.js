import { body, validationResult } from 'express-validator';

const userValidationRules = () => [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({min: 4,max: 32})
    .withMessage('Username must be between 4 and 32 characters long'),
  body('password').notEmpty().withMessage('Password is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ validationErrors: errors.array() });
  }
  next();
};
export { userValidationRules, validate };
