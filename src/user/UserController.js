import userService from './UserService';
import console from 'node:console';

class UserController {
  createUser = () => async (req, res) => {
    const user = await userService.createUser(req.body);
    console.log(user);
    res.status(201);
    res.send({ message: 'UserEntity created' });
  };
}

export default new UserController();
