import userRepository from './user.repository.js';

class UserService {
  async createUser(user) {
    return await userRepository.create({
      ...user,
      inactive: true,
    });
  }
}

export default new UserService();
