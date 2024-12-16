import userRepository from './UserRepository';

class UserService {
  async createUser(user) {
    return await userRepository.create(user);
  }
}

export default new UserService();
