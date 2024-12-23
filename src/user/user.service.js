import userRepository from './user.repository.js';

class UserService {
  async createUser(user) {
    return await userRepository.create({
      username: user.username,
      password: user.password,
      email: user.email,
    });
  }
}

export default new UserService();
