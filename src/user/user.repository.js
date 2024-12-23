import UserEntity from './user.entity.js';

class UserRepository {
  async create(user) {
    return UserEntity.create(user);
  }

  async findUserByEmail(email) {
    // noinspection JSCheckFunctionSignatures
    return UserEntity.findOne({ where: { email: email } });
  }
}

export default new UserRepository();
