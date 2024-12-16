import User from './UserEntity.js';

class UserRepository {
  async create(user) {
    return User.create(user);
  }
}

export default new UserRepository();