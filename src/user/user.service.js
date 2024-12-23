import userRepository from './user.repository.js';
import crypto from 'crypto';
import emailService from '../email/email.service.js';

const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

class UserService {
  async createUser(user) {
    const userToBeSaved = {
      ...user,
      inactive: true,
      activationToken: generateToken(16),
    };
    const savedUser = await userRepository.create(userToBeSaved);
    await emailService.sendAccountActivationEmail(
      userToBeSaved.email,
      userToBeSaved.activationToken
    );
    return savedUser;
  }
}

export default new UserService();
