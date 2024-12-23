import userRepository from './user.repository.js';
import crypto from 'crypto';

const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

class UserService {
  async createUser(user) {
    return await userRepository.create({
      ...user,
      inactive: true,
      activationToken: generateToken(16),
    });
  }
}

export default new UserService();
