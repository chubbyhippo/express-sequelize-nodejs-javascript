import User from './user.entity.js';

class UserRepository {
  async create(user) {
    return User.create(user);
  }
}

export default new UserRepository();