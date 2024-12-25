import userService from './user.service.js';
import console from 'node:console';

class UserController {
  createUser = () => async (req, res) => {
    try {
      await userService.createUser(req.body);
      res.status(201);
      res.send({ message: req.t('userCreated') });
    } catch (error) {
      res.status(502);
      console.error(error);
      res.send({ message: req.t('userCreationFailed') });
    }
  };
}

export default new UserController();
