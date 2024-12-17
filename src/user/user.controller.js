import userService from './user.service.js';

class UserController {
  createUser = () => async (req, res) => {
    const user = req.body;
    if (user.username === null) {
      res.status(400).send({ validationErrors: {} });
      return;
    }
    await userService.createUser(req.body);
    res.status(201);
    res.send({ message: 'UserEntity created' });
  };
}

export default new UserController();
