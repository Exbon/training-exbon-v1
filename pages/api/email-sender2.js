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
    subject: "Layout conflict",
    html: `<p>Exbon,</p>
           <p>While we are working on new wall layout, we found there is one existing light fixture conflicting with this new layout. Please inform us how to proceed. </p>
           <p>T-Wall Enterprise</p>`,
    text: "This is text version!",
    // replyTo: "receiverXXX@gmail.com",
    attachments: [
      {
        filename: "Photo.pdf",
        path: "./assets/img/training/Photo.pdf",
        contentType: "application/pdf",
      },
    ],
    onError: e => console.log(e),
    onSuccess: i => console.log(i),
  });
};

export default emailHandler;
