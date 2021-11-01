const emailConfig = require("../../../emailConfig.js");

const emailHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        var nodeoutlook = require("nodejs-nodemailer-outlook");

        nodeoutlook.sendEmail({
          auth: {
            user: emailConfig.emailConfig.user,
            pass: emailConfig.emailConfig.password,
          },
          from: "owner.pm@exbon.com",
          // to: "hyunmyung.kim" + "@exbon.com",
          to: body.username + "@exbon.com",
          subject: "[Training] Change Order Proposal Approval",
          html: `<p>Exbon,</p>
           <p>Please consider this email as a formal change order approval. Once your work is done, please submit your invoice accordingly. </p>
           <p>Thank you</p>
           <br/>
           <strong>Don Trump, OAR</strong>`,
          // text: "This is text version!",
          // replyTo: "receiverXXX@gmail.com",
          attachments: [
            // {
            //   filename: "FI #01 - Light Fixture Relocation.pdf",
            //   path: "./assets/img/training/FI #01 - Light Fixture Relocation.pdf",
            //   contentType: "application/pdf",
            // },
          ],
          onError: e => console.log(e),
          onSuccess: i => {
            console.log(i);
            res.status(200).json({
              //for preventing Timeout
              result: 1,
            });
            resolve();
          },
        });
        return resolve();

        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default emailHandler;
