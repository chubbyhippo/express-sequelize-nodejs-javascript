import userRepository from './user.repository.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import nodemailerStub from 'nodemailer-stub';

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

    const transporter = nodemailer.createTransport(
      nodemailerStub.stubTransport
    );
    await transporter.sendMail({
      from: '<EMAIL>',
      to: userToBeSaved.email,
      subject: 'Account activation',
      text: `Please click on the following link to activate your account: http://localhost:3000/activate/${userToBeSaved.activationToken}`,
    });
    return await userRepository.create(userToBeSaved);
  }
}

export default new UserService();
