const emailConfig = require("../../emailConfig.js");

const emailHandler = (req, res) => {
  const { method, body } = req;
  var nodeoutlook = require("nodejs-nodemailer-outlook");

  nodeoutlook.sendEmail({
    auth: {
      user: emailConfig.emailConfig.user,
      pass: emailConfig.emailConfig.password,
    },
    from: emailConfig.emailConfig.user,
    to: body.username + "@exbon.com",
    subject: "IT TRAINING PROGRAM TEST",
    html: "<b>This is bold text</b>",
    text: "This is text version!",
    // replyTo: "receiverXXX@gmail.com",
    // attachments: [

    // ],
    onError: e => console.log(e),
    onSuccess: i => console.log(i),
  });
};

export default emailHandler;
