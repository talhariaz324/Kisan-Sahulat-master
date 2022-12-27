const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    secure: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;

/*

They've changed security protocols. Now set your google account like below.

1- Turn on two-factor-authentication.
2- Security > Sign in in to Google > App passwords
3- Select app > Other > Custom name and click Generate.
4- Change current email's password with generated password.


Your transporter should be:
transport: {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@gmail.com',
    pass: 'app password',
  },
},
*/
