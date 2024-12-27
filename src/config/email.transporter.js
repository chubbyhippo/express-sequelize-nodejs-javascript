import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 2525,
  tls: { rejectUnauthorized: false },
});

export default transporter;
