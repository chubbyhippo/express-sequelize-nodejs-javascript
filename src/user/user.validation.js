import { body, validationResult } from 'express-validator';

const userValidationRules = () => [
  body('username').notEmpty().withMessage('Username is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ validationErrors: errors.array() });
  }
  next();
};
export { userValidationRules, validate };
