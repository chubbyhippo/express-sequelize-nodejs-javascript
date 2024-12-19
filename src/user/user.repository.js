import UserEntity from './user.entity.js';

class UserRepository {
  async create(user) {
    return UserEntity.create(user);
  }

  async findUserByEmail(email) {
    return UserEntity.findAll({ where: { email: email } });
  }
}

export default new UserRepository();
