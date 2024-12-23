import nodemailer from 'nodemailer';
import nodemailerStub from 'nodemailer-stub';

class EmailService {
  async sendAccountActivationEmail(email, activationToken) {
    const transporter = nodemailer.createTransport(
      nodemailerStub.stubTransport
    );

    await transporter.sendMail({
      from: '<EMAIL>',
      to: email,
      subject: 'Account activation',
      text: `Please click on the following link to activate your account: http://localhost:3000/activate/${activationToken}`,
    });
  }
}

export default new EmailService();
