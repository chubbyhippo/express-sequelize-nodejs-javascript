import userService from './user.service.js';

class UserController {
  createUser = () => async (req, res) => {
    await userService.createUser(req.body);
    res.status(201);
    res.send({ message: 'UserEntity created' });
  };
}

export default new UserController();
