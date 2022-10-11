/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
var nodemailer = require('nodemailer');
const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.sendEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password
      }
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'To Change your Password,Please click the link below',
      text: password
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

/**
 * sendQuestion
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.sendQuestion = pram => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password
      }
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: pram.email,
      subject: 'Question  Request',
      html: emailTemplate(pram)
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

const emailTemplate = pram => {
  return `
<body style="margin: 0; padding: 0">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff">
        <tr>
            <td align="center" style="padding: 0">
                <table role="presentation" style="width: 800px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left">
                    <tr>
                        <td align="center" style="padding: 20px 5px 10px 5px; background: rgba(206, 197, 237, 0.1)">
                            <span style="
      color: #7F56D9;
      font-size: 42px;
      font-family: fantasy;
      letter-spacing: 0;
      line-height: 42px;
      text-align: left;
    ">
      ${pram.title}
    </span>
    <h4 style=" font-family: Verdana; color: #7F56D9 ">${pram.question}</h4>
    <p style=" font-family: Verdana; color: #7F56D9 ">${pram.message}</p>
  </td>
</tr>
  
</table>
</body>
`;
};
