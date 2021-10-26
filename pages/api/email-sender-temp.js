const emailConfig = require("../../emailConfig.js");

const emailHandler = (req, res) => {
  const { method, body } = req;
  let nodemailer = require("nodemailer");
  console.log(emailConfig.emailConfig.user);
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,

    auth: {
      user: emailConfig.emailConfig.user,
      pass: emailConfig.emailConfig.password,
    },
    secureConnection: true,
    tls: {
      ciphers: "SSLv3",
    },
  });

  const mailData = {
    from: "training@exbon.com",
    to: "hyunmyung.kim@exbon.com",
    subject: `TEST`,
    text: "TEST",
    html: <div>TEST</div>,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

export default emailHandler;
