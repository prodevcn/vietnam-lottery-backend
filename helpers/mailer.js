"use strict";

const nodemailer = require('nodemailer');

exports.sendEmail = async () => {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  let info = await transporter.sendMail({
    form: '"Lottopoka" <Lottopoka@support.com>',
    to: "antony19951221@gmail.com, wu12211995@gmail.com",
    subject: "Lottery results were unmatched!",
    text: "The three results are different each other",
    html: "<b>Warning</b>"
  });

  console.log("[SUCCESS]:[SEND_MESSAGE]:%s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}