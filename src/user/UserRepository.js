import User from './UserEntity';

class UserRepository {
  async create(user) {
    return User.create(user);
  }
}

export default new UserRepository();