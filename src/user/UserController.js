import userRepository from './UserRepository.js';
import console from 'node:console';

class UserController {
  createUser = () => async (req, res) => {
    const user = await userRepository.create(req.body);
    console.log(user);
    res.status(201);
    res.send({ message: 'UserEntity created' });
  };
}

export default new UserController();
