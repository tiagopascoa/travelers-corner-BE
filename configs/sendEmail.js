require("dotenv").config();
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (receiver, source, subject, content) => {
  try {
    const data = {
      to: receiver,
      from: source,
      subject: subject,
      html: content,
    };
    return sgMail.send(data);
  } catch (e) {
    return new Error(e);
  }
};

module.exports = sendEmail;
