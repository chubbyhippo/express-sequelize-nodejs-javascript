import userRepository from './user.repository.js';
import crypto from 'crypto';
import emailService from './email.service.js';
import sequelize from '../config/database.js';
import EmailException from './email.exception.js';
import console from 'node:console';

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
    const transaction = await sequelize.transaction();
    const savedUser = await userRepository.create(userToBeSaved, {
      transaction,
    });
    try {
      await emailService.sendAccountActivationEmail(
        userToBeSaved.email,
        userToBeSaved.activationToken
      );
      await transaction.commit();
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw new EmailException();
    }
    return savedUser;
  }
}

export default new UserService();
