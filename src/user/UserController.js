import UserEntity from './UserEntity.js';
import console from 'node:console';

class UserController {
  createUser = () => async (req, res) => {
    const user = await UserEntity.create(req.body);
    console.log(user);
    res.status(201);
    res.send({ message: 'UserEntity created' });
  };
}

export default UserController;
