import transporter from '../config/email.transporter.js';

class EmailService {
  async sendAccountActivationEmail(email, activationToken) {
    await transporter.sendMail({
      from: '<EMAIL>',
      to: email,
      subject: 'Account activation',
      text: `Please click on the following link to activate your account: http://localhost:3000/activate/${activationToken}`,
    });
  }
}

export default new EmailService();
