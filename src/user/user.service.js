import userRepository from './user.repository.js';

class UserService {
  async createUser(user) {
    return await userRepository.create(user);
  }
}

export default new UserService();
